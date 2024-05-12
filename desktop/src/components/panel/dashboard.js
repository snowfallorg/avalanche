import * as Settings from "../../util/settings.js";
import * as DashboardRow from "./dashboard/row.js";
import * as DashboardItem from "./dashboard/item.js";

const settings = Settings.load();

export const create = ({ view }) => {
  const children = [];
  let row = DashboardRow.create({});

  for (const item of settings.panel.dashboard.items) {
    const size = DashboardItem.size(item);
    const widget = DashboardItem.create({ view, config: item });

    if (size === 1) {
      // 1x1
      if (row.children.length === 2) {
        children.push(row);
        row = DashboardRow.create({});
      }

      row.add(widget);
    } else {
      // 1x2 or 2x2
      if (row.children.length !== 0) {
        children.push(row);
        row = DashboardRow.create({});
      }

      row.add(widget);
      children.push(row);
      row = DashboardRow.create({});
    }
  }

  if (row.children.length !== 0) {
    children.push(row);
  }

  const content = Widget.Box({
    className: "AvalanchePanelDashboardContent",
    vertical: true,
    spacing: settings.panel.dashboard.gap,
    css: `padding-left: ${settings.panel.padding}px; padding-right: ${settings.panel.padding}px;`,
    vpack: "start",
    children,
  });

  const scrollable = Widget.Scrollable({
    hscroll: "never",
    vscroll: "automatic",
    vexpand: true,
    child: content,
  });

  const widget = Widget.Box({
    className: "AvalanchePanelDashboard",
    vertical: true,
    hexpand: true,
    vexpand: true,
    child: scrollable,
  });

  return widget;
};
