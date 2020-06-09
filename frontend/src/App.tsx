import * as React from "react";
import { Input } from "./components/Input";
import { Flex, Button } from "rebass";
import { ResultCard } from "./components/card";
import * as qs from "query-string";
import vibrant from "node-vibrant";
import { Response } from "common/types";
import { fetchApi } from "utils/api";
import { Loading } from "components/Loading";
import { parseQueryParams } from "utils/query";
import { validateInput } from "utils/validation";
import { buildGradient } from "utils/gradient";
import { Credits } from "components/Credits";
import { AnimatePresence, motion } from "framer-motion";

const App: React.FC = () => {
  const [value, setValue] = React.useState<string>(parseQueryParams());
  const [result, setResult] = React.useState<Response | null>(null);
  const [isValid, setValid] = React.useState<boolean>(validateInput(value));
  const [loading, setLoading] = React.useState<boolean>(false);
  const [buttonColor, setButtonColor] = React.useState<string>("#5d13d4");
  const [gradient, setGradient] = React.useState<string>(
    buildGradient([240, 240, 240], [250, 250, 250])
  );

  const onSubmit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      setLoading(true);

      fetchApi(value)
        .then(setResult)
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    },
    [value]
  );

  React.useEffect(() => {
    setValid(validateInput(value));

    const query = qs.stringify({ q: value });
    const path = `${window.location.protocol}//${window.location.host}${
      window.location.pathname
    }${value ? `?${query}` : ""}`;

    window.history.pushState({ path }, "", path);
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
        .then((palette) => {
          if (palette.DarkVibrant) {
            setButtonColor(palette.DarkVibrant.getHex());
          }

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
      setLoading(true);

      fetchApi(value)
        .then(setResult)
        .catch(() => {})
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = React.useCallback(() => {
    setResult(null);
  }, []);

  return (
    <Flex
      width={1}
      flexDirection="column"
      alignItems="center"
      py={[32, 120, 240]}
      sx={{
        minHeight: "100vh",
      }}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={gradient}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            top: 0,
            left: 0,
            background: gradient,
          }}
        />
      </AnimatePresence>
      <div style={{ maxWidth: 640, width: "100%", zIndex: 9 }}>
        <AnimatePresence initial={false} exitBeforeEnter={true}>
          {result ? (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 125 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <ResultCard onClose={reset} result={result} />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 125 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Flex
                mt={[5, 0]}
                mx={[2, 0]}
                as="form"
                height={56}
                onSubmit={onSubmit}
                flexDirection={["column", "row"]}
              >
                <Input value={value} onChange={setValue} />
                <Button
                  disabled={!isValid || loading}
                  sx={{
                    borderRadius: 99,
                    boxShadow: "small",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: isValid ? 1 : 0.875,
                    textShadow: "0 0 2px rgba(0,0,0,0.25)",
                  }}
                  bg={buttonColor}
                  color="#fff"
                  py={2}
                  px={4}
                  fontWeight={400}
                  type="submit"
                  width={[1, 128]}
                  m="initial"
                  mt={[2, 0]}
                >
                  {loading ? <Loading color="#fff" /> : "Search"}
                </Button>
              </Flex>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Credits />
    </Flex>
  );
};

export default App;
