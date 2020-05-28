import * as React from "react";
import { Input } from "./components/Input";
import { Flex, Button } from "rebass";
import axios from "axios";
import { ResultCard } from "./components/Result";
import * as qs from "query-string";
import vibrant from "node-vibrant";
import { animated, useTransition } from "react-spring";
import Spinner from "react-md-spinner";

export interface Result {
  cover: string;
  type: "artist" | "album" | "track";
  artist: string;
  album: string | null;
  title: string | null;
  preview: string | null;
  urls: string[];
}

const validateInput = (input: string): boolean =>
  !!input.match(/(open\.spotify|deezer\.com)/);

const initialQuery = (): string => {
  const q = qs.parse(window.location.search);
  return (q && q.q ? q.q : "") as string;
};

const buildGradient = (color1: number[], color2: number[]): string =>
  `linear-gradient(348deg,rgb(${color1.join(",")}) 0%,rgb(${color2.join(
    ","
  )}))`;

const URL =
  "https://europe-west1-jsaari-open-source.cloudfunctions.net/musalink?url=";

const fetch = (url: string) => axios.get<Result>(`${URL}${url}`);

const App: React.FC = () => {
  const [value, setValue] = React.useState<string>(initialQuery());
  const [result, setResult] = React.useState<Result | null>(null);
  const [isValid, setValid] = React.useState<boolean>(validateInput(value));
  const [loading, setLoading] = React.useState<boolean>(false);
  const [buttonColor, setButtonColor] = React.useState<string>("#aaa");
  const [gradient, setGradient] = React.useState<string>(
    buildGradient([84, 46, 113], [226, 109, 92])
  );

  const transitions = useTransition(result, null, {
    from: {
      position: "absolute",
      transform: "scale(0.9) translate3d(0, 150px, 0)",
      maxWidth: 640,
      width: "100%"
    },
    enter: {
      opacity: 1,
      transform: "scale(1) translate3d(0, 0px, 0)"
    },
    leave: {
      opacity: 0,
      transform: "scale(0.9) translate3d(0, 150px, 0)"
    }
  });

  const onSubmit = React.useCallback(
    async e => {
      e.preventDefault();
      try {
        setLoading(true);
        const { data } = await fetch(value);
        if (typeof data !== "string") {
          setResult(data);
        }
      } catch (e) {
        setLoading(false);
      }
    },
    [value]
  );

  React.useEffect(() => {
    setValid(validateInput(value));
    const query = qs.stringify({ q: value });
    const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}?${query}`;
    window.history.pushState({ path: url }, "", url);
  }, [value]);

  React.useEffect(() => {
    if (result) {
      setLoading(false);

      window.document.title = `${result.artist}${
        result.type !== "artist" ? ` - ${result.title || result.album}` : ""
      }`;

      vibrant
        .from(result.cover)
        .getPalette()
        .then(palette => {
          setButtonColor(
            palette.DarkMuted ? palette.DarkMuted.getHex() : "#aaa"
          );
          setGradient(
            buildGradient(
              palette.Muted ? palette.Muted.getRgb() : [226, 109, 92],
              palette.LightVibrant
                ? palette.LightVibrant.getRgb()
                : [84, 46, 113]
            )
          );
        });
    }
  }, [result]);

  React.useEffect(() => {
    if (validateInput(value)) {
      fetch(value).then(({ data }) => {
        if (typeof data !== "string") {
          setResult(data);
        }
      });
    }
  }, []);

  return (
    <Flex
      width={1}
      flexDirection="column"
      alignItems="center"
      height="100vh"
      py={[32, 120, 240]}
      bg={gradient}
    >
      <div style={{ maxWidth: 640, width: "100%" }}>
        {transitions.map(({ item, props, key }) =>
          item ? (
            <animated.div key={key} style={props}>
              <ResultCard onClose={() => setResult(null)} result={result} />
            </animated.div>
          ) : (
            <animated.div key={key} style={props}>
              <Flex
                mt={[5, 0]}
                mx={[2, 0]}
                as="form"
                onSubmit={onSubmit}
                flexDirection={["column", "row"]}
              >
                <Input value={value} onChange={setValue} />
                <Button
                  disabled={!isValid || loading}
                  sx={{ borderRadius: 99 }}
                  bg={isValid ? buttonColor : "#aaa"}
                  color={isValid ? "#fff" : "#444"}
                  py={3}
                  px={4}
                  fontWeight={400}
                  type="submit"
                  width={[1, 128]}
                  m="initial"
                  mt={[2, 0]}
                >
                  {loading ? (
                    <Spinner size={18} singleColor="#fff" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </Flex>
            </animated.div>
          )
        )}
      </div>
    </Flex>
  );
};

export default App;
