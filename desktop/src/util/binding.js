import { deepEqual } from "./misc.js";

// A memoized version of `binding.as()` to avoid constantly re-rendering
// when certain emitters are noisy.
export const as = (binding, f) => {
  let isFirst = true;
  let prevArgs = undefined;
  let last = undefined;

  return binding.as((...args) => {
    if (isFirst) {
      prevArgs = args;
      last = f(...args);
      isFirst = false;

      return last;
    }

    if (!deepEqual(prevArgs, args)) {
      prevArgs = args;
      last = f(...args);
    }

    return last;
  });
};
