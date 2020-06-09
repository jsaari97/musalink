import * as React from "react";
import { Flex, Text } from "rebass";

export const Credits: React.FC = () => {
  return (
    <Flex
      sx={{
        position: "absolute",
        bottom: 3,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <Text fontSize={0} color="#f1f1f1" sx={{ textShadow: "0 2px 4px rgba(0,0,0,0.25)" }}>
        2020 - Made by Jim Saari
      </Text>
    </Flex>
  );
};
