import * as Settings from "../../util/settings.js";
import * as Windows from "../../util/windows.js";

const settings = Settings.load();

export const create = ({ view }) => {
  const button = Widget.EventBox({
    className: "AvalancheBarDashboard",
    cursor: "pointer",
    heightRequest: settings.bar.width,
    child: Widget.Icon({
      cursor: "pointer",
      icon: "avalanche",
      css: `font-size: ${settings.bar.width}px`,
    }),
    onPrimaryClick: () => {
      if (view.value === "dashboard") {
        view.value = "";
      } else {
        view.value = "dashboard";
      }
    },
  });

  return button;
};
