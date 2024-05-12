import Glib from "gi://GLib";

import * as Settings from "./util/settings.js";
import * as Globals from "./util/globals.js";
import * as Bar from "./components/bar.js";
import * as Launcher from "./components/launcher.js";

const Hyprland = await Service.import("hyprland");

const settings = Settings.load();

App.config({
  style: settings.css,
  icons: settings.assets,
});

Globals.initialize();

const mode = Glib.getenv("AVALANCHE_DESKTOP_MODE") || "bar";

if (mode === "bar") {
  const bars = globalThis.avalanche.bars;

  Bar.populate(Hyprland.monitors, bars);

  Hyprland.connect("monitor-added", (hyprland) => {
    Bar.clear(bars);
    Bar.populate(hyprland.monitors, bars);
  });

  Hyprland.connect("monitor-removed", (hyprland) => {
    Bar.clear(bars);
    Bar.populate(hyprland.monitors, bars);
  });
}

if (mode === "launcher") {
  Launcher.launch();
}
