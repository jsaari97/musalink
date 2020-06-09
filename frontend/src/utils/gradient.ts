export const buildGradient = (
  startColor: number[],
  endColor: number[]
): string =>
  `linear-gradient(348deg,rgb(${startColor.join(",")}) 0%,rgb(${endColor.join(
    ","
  )}))`;
