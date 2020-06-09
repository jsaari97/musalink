import * as React from "react";
import { Response } from "common/types";
import { Card, Flex, Heading, Box, Button } from "rebass";
import { MusicLink } from "components/MusicLink";
import { ReactComponent as CloseIcon } from "svg/close.svg";
import { CardCover } from "./cover";

interface ResultProps {
  result: Response | null;
  onClose: () => void;
}

export const ResultCard: React.FC<ResultProps> = ({ result, onClose }) => {
  return (
    <Card
      p={4}
      sx={{
        borderRadius: 24,
        boxShadow: "large",
        position: "relative",
        zIndex: 2,
        minHeight: 320,
      }}
      mx={2}
      bg="#fff"
    >
      <Button
        onClick={onClose}
        variant="clear"
        sx={{ position: "absolute", top: 3, right: 3 }}
        title="Close"
      >
        <CloseIcon height={32} width={32} fill="#444" />
      </Button>
      {result && (
        <Flex flexDirection={["column", "row"]} alignItems="center">
          <CardCover image={result.cover} preview={result.preview} />
          <Flex
            flex={1}
            justifyContent="space-around"
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
              {result.urls.map((link) => (
                <MusicLink key={link} link={link} />
              ))}
            </Box>
          </Flex>
        </Flex>
      )}
    </Card>
  );
};
