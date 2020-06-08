import * as React from "react";
import { Flex, Box } from "rebass";

interface InputProps {
  onChange: (value: string) => void;
  value: string;
}

export const Input: React.FC<InputProps> = ({ onChange, value }) => {
  return (
    <Flex flex={1} mr={[0, 3]}>
      <Box
        as="input"
        sx={{
          flex: 1,
          borderRadius: "3rem",
          outline: 0,
          border: 0,
          fontSize: 2,
          pl: 4,
          boxShadow: "0 0 4px rgba(0, 0, 0, 0.125)",
          minHeight: 42,
        }}
        value={value}
        onChange={({ target }: any) => {
          const filtered = target.value.match(/.+?(\?)/);
          onChange(
            filtered
              ? filtered[0].substr(0, filtered[0].length - 1)
              : target.value
          );
        }}
        placeholder="Paste track, album or artist link"
        onFocus={(e: any) => {
          e.target.select();
        }}
      />
    </Flex>
  );
};
