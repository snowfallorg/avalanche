import * as Settings from "../../../util/settings.js";

const settings = Settings.load();

export const create = ({ ...options }) => {
  const row = Widget.Box({
    hpack: "start",
    hexpand: true,
    spacing: settings.panel.dashboard.gap,
    ...options,
    className: `AvalanchePanelDashboardRow ${options.className ?? ""}`,
  });

  return row;
};
