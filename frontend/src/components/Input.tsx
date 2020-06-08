import * as React from "react";
import { Flex, Box } from "rebass";

interface InputProps {
  onChange: (value: string) => void;
  value: string;
}

const pruneQueryParams = (url: string): string => {
  // Check if string has query params
  const filtered = url.match(/.+?(\?)/);

  return filtered ? filtered[0].substr(0, filtered[0].length - 1) : url;
};

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
      e.target.focus();
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
          boxShadow: "0 0 4px rgba(0, 0, 0, 0.125)",
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
