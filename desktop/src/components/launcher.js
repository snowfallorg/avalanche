import Glib from "gi://GLib";

import * as Settings from "../util/settings.js";
import * as Windows from "../util/windows.js";

import * as Dashboard from "./panel/dashboard.js";
import * as Apps from "./panel/apps.js";

const Hyprland = await Service.import("hyprland");

const settings = Settings.load();

export const create = ({ monitor, view }) => {
  const name = `avalanche-launcher`;

  const layers = Utils.exec("hyprctl layers -j");

  try {
    const json = JSON.parse(layers);

    const layer = json[monitor.name]?.levels?.[3] ?? [];

    const exists = layer.some((item) => item.namespace === name);

    if (exists) {
      console.log(`Launcher is already running on ${monitor.name}`);
      App.quit();
      return;
    }
  } catch (error) {
    console.error("Could not list Hyprland layers");
  }

  const content = Widget.Revealer({
    // FIXME: For some reason it doesn't seem to be possible to place the panel below
    // the bar which results in the panel contents animating in _over_ the bar.
    // transition: "slide_right",
    transition: "none",
    transitionDuration: 250,
    revealChild: false,
    hpack: "start",
    vpack: "fill",
    vexpand: true,
    css: `margin-left: ${settings.bar.width}px;`,
    setup: (self) => {
      self.hook(view, () => {
        if (view.value === "") {
          self.reveal_child = false;
        } else {
          setTimeout(() => {
            self.reveal_child = true;
          }, 0);
        }
      });
    },
    child: Widget.Box({
      // NOTE: This causes an error about a "negative content size", but things seem to
      // work properly.
      css: `margin-left: ${settings.bar.width}px; min-width: ${settings.panel.width}px`,
      className: "AvalanchePanelContent",
      hpack: "start",
      vpack: "fill",
      vexpand: true,
      child: view.bind().as((v) => {
        switch (v) {
          default:
          case "dashboard":
            return Dashboard.create({ view });
          case "apps":
            return Apps.create({ view });
        }
      }),
    }),
  });

  const launcher = Windows.create(monitor, {
    name,
    className: "AvalancheLauncher",
    layer: "top",
    keymode: "exclusive",
    exclusivity: "ignore",
    anchor: ["top", "left", "bottom", "right"],
    setup: (self) => {
      self.keybind("Escape", () => {
        Windows.remove(name);
        App.quit();
      });

      self.hook(view, () => {
        if (view.value === "") {
          Windows.remove(name);
          App.quit();
        }
      });
    },
    child: Widget.Overlay({
      vexpand: true,
      child: Widget.Box({
        className: "AvalanchePanelOverlay",
        hexpand: true,
        vexpand: true,
      }),
      overlays: [
        Widget.Button({
          className: "AvalanchePanelBackdropScrim",
          css: `margin-left: ${settings.bar.width}px;`,
          hpack: "fill",
          vpack: "fill",
          onClicked: (self) => {
            Windows.remove(name);
            App.quit();
          },
        }),
        content,
        Widget.Button({
          className: "AvalanchePanelBarScrim",
          hpack: "start",
          vpack: "fill",
          widthRequest: settings.bar.width,
          onClicked: (self) => {
            Windows.remove(name);
            App.quit();
          },
        }),
      ],
    }),
  });

  return launcher;
};

export const launch = () => {
  const monitor = Hyprland.monitors.find(
    (m) => m.id === Hyprland.active.monitor.id,
  );

  if (monitor) {
    const view = Variable(Glib.getenv("AVALANCHE_LAUNCHER_VIEW") || "apps");

    const launcher = create({ monitor, view });

    if (launcher) {
      Windows.add(launcher.name, launcher);
    }
  }
};
