import * as React from "react";
import { Result as ResultInterface } from "../App";
import { Card, Flex, Image, Heading, Box } from "rebass";
import { MusicLink } from "./MusicLink";
import { ReactComponent as CloseIcon } from "../svg/close.svg";
import { ReactComponent as PlayIcon } from "../svg/play.svg";
import { ReactComponent as PauseIcon } from "../svg/pause.svg";
import { css } from "@emotion/core";

interface ResultProps {
  result: ResultInterface | null;
  onClose: () => void;
}

const controlStyle = {
  height: 80,
  width: 80,
  fill: "#fff"
};

export const ResultCard: React.FC<ResultProps> = ({ result, onClose }) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("ended", () => {
        setPlaying(false);
      });
    }
  }, [audioRef]);

  return (
    <Card
      p={4}
      sx={{
        borderRadius: 24,
        boxShadow: "small",
        position: "relative",
        zIndex: 2,
        minHeight: 320
      }}
      mx={2}
      bg="#fff"
    >
      <CloseIcon
        style={{ position: "absolute", top: 12, right: 12 }}
        onClick={onClose}
        height={32}
        width={32}
        fill="#444"
      />
      {result && (
        <Flex flexDirection={["column", "row"]} alignItems="center">
          {result.preview && (
            <audio ref={audioRef} controls={false} src={result.preview} />
          )}
          <Box
            width={256}
            height={256}
            style={{ position: "relative" }}
            mb={[24, 0]}
          >
            {result.preview && (
              <div
                css={css`
                  position: absolute;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  left: 0;
                  margin: auto;
                  height: 80px;
                  width: 80px;
                  pointer-events: none;
                `}
              >
                {playing ? (
                  <PauseIcon {...controlStyle} />
                ) : (
                  <PlayIcon {...controlStyle} />
                )}
              </div>
            )}
            <Image
              sx={{ objectFit: "cover", borderRadius: 999 }}
              onClick={() => {
                if (audioRef && audioRef.current) {
                  if (!playing) {
                    audioRef.current.play();
                    setPlaying(true);
                  } else {
                    audioRef.current.pause();
                    setPlaying(false);
                  }
                }
              }}
              width={256}
              height={256}
              src={result.cover}
            />
          </Box>
          <Flex
            justifyContent="space-around"
            flex={1}
            flexDirection="column"
            alignItems="center"
          >
            <Flex flexDirection="column" alignItems="center">
              {result.type !== "artist" && (
                <Heading
                  m="initial"
                  mb={2}
                  lineHeight={1}
                  textAlign="center"
                  fontSize={5}
                  as="h1"
                >
                  {result.title || result.album}
                </Heading>
              )}
              <Heading
                textAlign="center"
                fontSize={result.title || result.album ? 3 : 5}
                as={result.title || result.album ? "h2" : "h1"}
                color="#333"
              >
                {result.artist}
              </Heading>
              {result.type === "track" && (
                <Heading
                  textAlign="center"
                  color="#666"
                  fontWeight={500}
                  fontSize={2}
                  as="h3"
                >
                  {result.album}
                </Heading>
              )}
            </Flex>
            <Box mt={4}>
              {result.urls.map(link => (
                <MusicLink key={link} link={link} />
              ))}
            </Box>
          </Flex>
        </Flex>
      )}
    </Card>
  );
};
