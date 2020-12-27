import * as React from "react";
import * as qs from "query-string";
import vibrant from "node-vibrant";
import { AnimatePresence, motion } from "framer-motion";

import { Input } from "./components/Input";
import { ResultCard } from "./components/card";
import { Response } from "common/types";
import { fetchApi } from "utils/api";
import { Loading } from "components/Loading";
import { parseQueryParams } from "utils/query";
import { validateInput } from "utils/validation";
import { buildGradient } from "utils/gradient";
import { Credits } from "components/Credits";

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
    <main className="w-full flex flex-col items-center py-12 md:py-32 lg:py-64 min-h-screen">
      <AnimatePresence initial={false}>
        <motion.div
          key={gradient}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute w-full h-full top-0 left-0"
          style={{
            background: gradient,
          }}
        />
      </AnimatePresence>
      <div className="max-w-2xl w-full z-20">
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
              <form
                className="mt-12 md:mt-0 mx-6 md:mx-0 h-auto md:h-12 flex flex-col md:flex-row"
                onSubmit={onSubmit}
              >
                <Input value={value} onChange={setValue} />
                <button
                  disabled={!isValid || loading}
                  className="shadow-md flex items-center justify-center rounded-full text-white py-6 md:py-4 px-4 h-8 md:h-auto w-full md:w-32 mt-2 md:mt-0"
                  style={{
                    textShadow: "0 0 2px rgba(0,0,0,0.25)",
                    backgroundColor: buttonColor,
                  }}
                  type="submit"
                >
                  {loading ? <Loading color="#fff" /> : "Search"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Credits />
    </main>
  );
};

export default App;
