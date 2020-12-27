import * as React from "react";
import { Response } from "common/types";
import { MusicLink } from "./link";
import { ReactComponent as CloseIcon } from "svg/close.svg";
import { CardCover } from "./cover";

interface ResultProps {
  result: Response | null;
  onClose: () => void;
}

export const ResultCard: React.FC<ResultProps> = ({ result, onClose }) => {
  return (
    <div className="relative p-8 shadow-lg border border-gray-200 rounded-lg z-10 bg-white mx-4 md:mx-0">
      <button
        onClick={onClose}
        className="absolute top-3 right-3"
        title="Close"
      >
        <CloseIcon height={32} width={32} fill="#444" />
      </button>
      {result && (
        <div className="flex flex-col md:flex-row items-center">
          <CardCover image={result.cover} preview={result.preview} />
          <div className="flex flex-col flex-auto justify-around items-center">
            <div className="flex flex-col items-center mb-6">
              {result.type !== "artist" && (
                <h1 className="text-3xl font-bold text-center mb-2">
                  {result.title || result.album}
                </h1>
              )}
              <h2 className="text-xl font-semibold text-center mb-1 text-gray-700">
                {result.artist}
              </h2>
              {result.type === "track" && (
                <h3 className="text-lg font-medium text-center text-gray-500">
                  {result.album}
                </h3>
              )}
            </div>
            <div className="flex">
              {result.urls.map((link) => (
                <MusicLink key={link} link={link} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
