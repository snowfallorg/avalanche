import * as Stats from "./stats.js";
import * as Calendar from "./calendar.js";
import * as Network from "./network.js";

export const create = ({ view, config }) => {
  switch (config.name) {
    default:
    case "stats":
      return Stats.create({ view, config });
    case "calendar":
      return Calendar.create({ view, config });
    case "network":
      return Network.create({ view, config });
  }
};

export const size = (config) => {
  switch (config.name) {
    default:
      return 2;
    case "stats":
      return config.size ?? 1;
    case "calendar":
      return config.size ?? 1;
    case "network":
      return config.size ?? 1;
  }
};
