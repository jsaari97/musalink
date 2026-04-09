import * as React from "react";
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
    <div className="flex flex-auto md:mr-3 mb-3 md:mb-0">
      <input
        type="text"
        className="flex-auto outline-none rounded-full border border-gray-100 bg-white text-md shadow-md pl-4 md:pl-6 py-3 md:py-0"
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        placeholder="Paste track, album or artist link"
      />
    </div>
  );
};
