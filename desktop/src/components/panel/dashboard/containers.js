import * as Settings from "../../../util/settings.js";

const settings = Settings.load();

export const SINGLE_ITEM_SIZE =
  settings.panel.width / 2 -
  settings.panel.padding -
  settings.panel.dashboard.gap / 2;

export const DOUBLE_ITEM_SIZE =
  SINGLE_ITEM_SIZE * 2 + settings.panel.dashboard.gap;

export const DashboardItem1x1 = ({ ...options }) => {
  const item = Widget.Box({
    hexpand: true,
    ...options,
    css: `min-width: ${SINGLE_ITEM_SIZE}px; min-height: ${SINGLE_ITEM_SIZE}px; ${options.css ?? ""}`,
    className: `AvalanchePanelDashboardItem ${options.className ?? ""}`,
  });

  return item;
};

export const DashboardItem1x2 = ({ ...options }) => {
  const item = Widget.Box({
    hexpand: true,
    ...options,
    css: `min-width: ${DOUBLE_ITEM_SIZE}px; min-height: ${SINGLE_ITEM_SIZE}px; ${options.css ?? ""}`,
    className: `AvalanchePanelDashboardItem ${options.className ?? ""}`,
  });

  return item;
};

export const DashboardItem2x2 = ({ ...options }) => {
  const item = Widget.Box({
    hexpand: true,
    ...options,
    css: `min-width: ${DOUBLE_ITEM_SIZE}px; min-height: ${DOUBLE_ITEM_SIZE}px; ${options.css ?? ""}`,
    className: `AvalanchePanelDashboardItem ${options.className ?? ""}`,
  });

  return item;
};

export const ContainerFromSize = {
  1: DashboardItem1x1,
  2: DashboardItem1x2,
  3: DashboardItem2x2,
};
