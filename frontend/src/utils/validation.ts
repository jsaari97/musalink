export const validateInput = (input: string): boolean =>
  !!input.match(/(open\.spotify|deezer\.com)/);
