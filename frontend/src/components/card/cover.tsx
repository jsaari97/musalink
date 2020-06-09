import * as React from "react";
import { Button, Box, Image } from "rebass";
import { ReactComponent as PlayIcon } from "svg/play.svg";
import { ReactComponent as PauseIcon } from "svg/pause.svg";
import { motion } from "framer-motion";

interface CardCoverProps {
  image: string;
  preview: string | null;
}

const styles = {
  control: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: "auto",
    height: 96,
    width: 96,
    pointerEvents: "none",
    "& > svg": {
      filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.25))",
    },
  },
};

export const CardCover: React.FC<CardCoverProps> = ({ image, preview }) => {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = React.useState<boolean>(false);

  const ControlIcon = React.useMemo(() => (playing ? PauseIcon : PlayIcon), [
    playing,
  ]);

  React.useEffect(() => {
    if (audioRef.current) {
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
    <Button
      disabled={!preview}
      onClick={handlePreviewPress}
      variant="clear"
      width={256}
      height={256}
      mb={[24, 0]}
    >
      <motion.div
        style={{ position: "relative" }}
        whileTap={{ scale: 0.925 }}
      >
        {!!preview && (
          <>
            <audio ref={audioRef} controls={false} src={preview} />
            <Box sx={styles.control}>
              <ControlIcon height={96} width={96} fill="#fff" />
            </Box>
          </>
        )}
        <Image
          sx={{ objectFit: "cover", borderRadius: "50%" }}
          width={256}
          height={256}
          src={image}
        />
      </motion.div>
    </Button>
  );
};
