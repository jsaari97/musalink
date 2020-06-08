import * as React from "react";
import { ReactComponent as DeezerIcon } from "svg/deezer.svg";
import { ReactComponent as SpotifyIcon } from "svg/spotify.svg";
import { Link } from "rebass";

interface MusicLinkProps {
  link: string;
}

const determineType = (link: string): "spotify" | "deezer" | null =>
  link.match(/open\.spotify/)
    ? "spotify"
    : link.match(/deezer\.com/)
    ? "deezer"
    : null;

const iconStyle = {
  height: 64,
  width: 64,
  fill: "#333",
};

export const MusicLink: React.FC<MusicLinkProps> = ({ link }) => {
  const service = determineType(link);

  const ServiceIcon = React.useMemo((): React.ElementType | null => {
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
    <Link
      mx={2}
      href={link}
      title={`Listen on ${service}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      <ServiceIcon {...iconStyle} />
    </Link>
  );
};
