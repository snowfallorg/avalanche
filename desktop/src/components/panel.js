import * as Windows from "../util/windows.js";
import * as Settings from "../util/settings.js";

import * as Dashboard from "./panel/dashboard.js";
import * as Apps from "./panel/apps.js";

const settings = Settings.load();

export const create = ({ monitor, view }) => {
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

  const panel = Windows.create(monitor, {
    name: `avalanche-panel-${monitor.name}-${monitor.id}`,
    className: "AvalanchePanel",
    exclusivity: "ignore",
    anchor: ["top", "left", "bottom", "right"],
    keymode: "on-demand",
    layer: "top",
    setup: (self) => {
      self.keybind("Escape", () => {
        if (view.value !== "") {
          view.setValue("");
        }
      });

      self.hook(
        view,
        () => {
          if (view.value === "") {
            panel.hide();
          } else {
            panel.show();
          }
        },
        "changed",
      );
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
            view.setValue("");
            self.has_focus = false;
            self.unset_focus_chain();
          },
        }),
        content,
        Widget.Button({
          className: "AvalanchePanelBarScrim",
          hpack: "start",
          vpack: "fill",
          widthRequest: settings.bar.width,
          onClicked: (self) => {
            view.setValue("");
            self.has_focus = false;
            self.unset_focus_chain();
          },
        }),
      ],
    }),
  });

  panel.hide();

  return panel;
};
