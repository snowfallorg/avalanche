import Gdk from "gi://Gdk?version=3.0";

const Hyprland = await Service.import("hyprland");

export const known = {
  "framework-builtin": {
    make: "BOE",
    model: "0x095F",
  },
};

export const getMonitors = () => {
  return Hyprland.monitors;
};

export const getMonitorName = (monitor) => {
  for (const [name, { make, model }] of Object.entries(known)) {
    if (monitor.make === make && monitor.model === model) {
      return name;
    }
  }

  return `${monitor.make}-${monitor.model}`;
};

export const getGdkMonitorFromHyprlandId = (id) => {
  const target = Hyprland.monitors.find((monitor) => monitor.id === id);
  const display = Gdk.Display.get_default();
  const monitor = display?.get_monitor_at_point(target?.x ?? 0, target?.y ?? 0);

  return monitor;
};
