import * as React from "react";
import { determineService } from "musalink-common/utils";
import { ReactComponent as DeezerIcon } from "svg/deezer.svg";
import { ReactComponent as SpotifyIcon } from "svg/spotify.svg";
import { motion } from "framer-motion";

interface MusicLinkProps {
  link: string;
}

export const MusicLink: React.FC<MusicLinkProps> = ({ link }) => {
  const service = determineService(link);

  const ServiceIcon = React.useMemo((): typeof DeezerIcon | null => {
    switch (service) {
      case "deezer":
        return DeezerIcon;
      case "spotify":
        return SpotifyIcon;
      default:
        return null;
    }
  }, [service]);

  if (!ServiceIcon) {
    return null;
  }

  return (
    <a
      className="mx-2"
      href={link}
      title={`Listen on ${service}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      <motion.div whileTap={{ scale: 0.8 }} whileHover={{ scale: 1.125 }}>
        <ServiceIcon height={64} width={64} fill="#444" />
      </motion.div>
    </a>
  );
};
