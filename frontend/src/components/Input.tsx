import * as React from "react";
import { Flex, Box } from "rebass";
import { pruneQueryParams } from "utils/query";

interface InputProps {
  onChange: (value: string) => void;
  value: string;
}

export const Input: React.FC<InputProps> = ({ onChange, value }) => {
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const url = pruneQueryParams(e.target.value);

      onChange(url);
    },
    [onChange]
  );

  const handleFocus = React.useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
    },
    []
  );

  return (
    <Flex flex={1} mr={[0, 3]}>
      <Box
        as="input"
        type="text"
        sx={{
          flex: 1,
          borderRadius: "3rem",
          outline: 0,
          border: 0,
          fontSize: 2,
          pl: 4,
          boxShadow: "small",
          minHeight: 42,
        }}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder="Paste track, album or artist link"
      />
    </Flex>
  );
};
