const Hyprland = await Service.import("hyprland");

const bars = new Map();

export const initialize = () => {
  globalThis.avalanche = {
    bars,
    active: {
      setView: setViewForActiveBar,
      getBar: getActiveBar,
    },
  };
};

export const getActiveBar = () => {
  const monitor = Hyprland.active.monitor;

  for (const bar of bars.values()) {
    if (bar.hyprland.monitor.name === monitor.name) {
      return bar;
    }
  }

  return null;
};

export const setViewForActiveBar = (view) => {
  const bar = getActiveBar();

  if (bar) {
    bar.view.value = view;
  }
};
