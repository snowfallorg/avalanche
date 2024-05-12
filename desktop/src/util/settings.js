import Glib from "gi://GLib";

let isLoaded = false;

let settings = {
  css: `${App.configDir}/style.css`,
  assets: `${App.configDir}/assets`,

  bar: {
    width: 48,

    dashboard: {
      enable: true,
    },

    workspaces: {
      enable: true,
      count: 10,
    },

    volume: {
      enable: true,
    },

    bluetooth: {
      enable: true,
    },

    network: {
      enable: true,
    },

    battery: {
      enable: true,
    },

    time: {
      enable: true,
    },
  },

  panel: {
    width: 400,
    padding: 16,

    apps: {
      sort: true,
    },

    dashboard: {
      gap: 12,

      stats: {
        network: {
          max: 1024 * 1024 * 1024,
        },
      },

      items: [
        {
          name: "stats",
          size: 1,
        },
        {
          name: "network",
          size: 1,
        },
        {
          name: "calendar",
          size: 3,
        },
      ],
    },
  },

  notifications: {
    gap: {
      outer: 16,
      inner: 16,
    },
  },
};

const override = (target, key, value) => {
  if (Array.isArray(value)) {
    target[key] = value;
  } else if (typeof value === null) {
    target[key] = value;
  } else if (typeof value === "object") {
    for (const [subkey, subvalue] of Object.entries(value)) {
      override(target[key], subkey, subvalue);
    }
  } else {
    target[key] = value;
  }
};

export const load = () => {
  if (isLoaded) {
    return settings;
  }

  const file = Glib.getenv("AVALANCHE_DESKTOP_SETTINGS");

  if (file) {
    try {
      const overrides = JSON.parse(Utils.readFile(file));

      for (const [key, value] of Object.entries(overrides)) {
        override(settings, key, value);
      }
    } catch (error) {
      console.error(`Could not parse file: ${file}`);
    }
  }

  isLoaded = true;

  return settings;
};
