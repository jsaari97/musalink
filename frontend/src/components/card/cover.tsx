import * as React from "react";
import { ReactComponent as PlayIcon } from "svg/play.svg";
import { ReactComponent as PauseIcon } from "svg/pause.svg";
import { motion } from "framer-motion";

interface CardCoverProps {
  image: string;
  preview: string | null;
}

export const CardCover: React.FC<CardCoverProps> = ({ image, preview }) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = React.useState<boolean>(false);

  const ControlIcon = React.useMemo(() => (playing ? PauseIcon : PlayIcon), [
    playing,
  ]);

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.addEventListener("ended", () => {
        setPlaying(false);
      });
    }
  }, [audioRef]);

  const handlePreviewPress = React.useCallback(() => {
    if (audioRef && audioRef.current) {
      if (!playing) {
        audioRef.current.play();
        setPlaying(true);
      } else {
        audioRef.current.pause();
        setPlaying(false);
      }
    }
  }, [playing, audioRef]);

  return (
    <motion.button
      disabled={!preview}
      onClick={handlePreviewPress}
      className="w-64 h-64 flex-shrink-0 relative focus:outline-none mb-6 md:mb-0"
      whileTap={{ scale: 0.85 }}
      whileHover={{ scale: 1.025 }}
    >
      {!!preview && (
        <>
          <audio ref={audioRef} controls={false} src={preview} />
          <div className="pointer-events-none absolute m-auto inset-0 w-24 h-24">
            <ControlIcon
              className="w-24 h-24"
              fill="#fff"
              style={{ filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.25))" }}
            />
          </div>
        </>
      )}
      <img
        className="w-full h-full rounded-full object-cover"
        alt="Album cover"
        src={image}
      />
    </motion.button>
  );
};
