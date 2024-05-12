import * as Monitors from "../util/monitors.js";

const Hyprland = await Service.import("hyprland");

export const windows = new Map();

export const remove = (name) => {
  if (!windows.has(name)) {
    return;
  }

  const window = windows.get(name);

  App.removeWindow(window);
  windows.delete(name);
};

export const add = (name, window) => {
  if (windows.has(name)) {
    remove(name);
  }

  App.addWindow(window);
  windows.set(name, window);
};

export const create = (monitor, options) => {
  const monitorIdOrGdkMonitorInstance = Monitors.getGdkMonitorFromHyprlandId(
    monitor.id,
  );
  const gdkMonitorId =
    typeof monitorIdOrGdkMonitorInstance === "number"
      ? monitorIdOrGdkMonitorInstance
      : undefined;
  const gdkMonitorInstance =
    typeof monitorIdOrGdkMonitorInstance === "number"
      ? undefined
      : monitorIdOrGdkMonitorInstance;

  const window = Widget.Window({
    ...options,
    monitor: gdkMonitorId,
    gdkmonitor: gdkMonitorInstance,
  });

  // @ts-expect-error
  window.hyprland = {
    monitor,
  };

  return window;
};

export const monitor = (window) => {
  if (window.hyprland) {
    return window.hyprland.monitor;
  }

  return Hyprland.monitors[0];
};
