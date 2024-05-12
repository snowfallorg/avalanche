import Gtk from "gi://Gtk?version=3.0";
import * as Settings from "../../../util/settings.js";
import { network } from "../../bar/network.js";
import * as Containers from "./containers.js";
import * as Stats from "./stats.js";
import * as Binding from "../../../util/binding.js";

const Network = await Service.import("network");

const settings = Settings.load();

const humanBytes = (bytes) => {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes === 0) {
    return "0 B";
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`;
};

export const create = ({ view, config }) => {
  const Container = Containers.ContainerFromSize[config.size];

  return Container({
    className: "AvalanchePanelDashboardItemNetwork small",
    child: Widget.Box({
      className: "AvalanchePanelDashboardItemNetworkContent",
      vertical: true,
      hexpand: true,
      vexpand: true,
      hpack: "start",
      vpack: "start",
      child: Binding.as(network, (n) => {
        if (n.type === "wired") {
          return Widget.Overlay({
            className: "AvalanchePanelDashboardItemNetworkInfoOverlay wired",
            hexpand: true,
            child: Widget.Box({
              css: `min-width: ${Containers.SINGLE_ITEM_SIZE}px; min-height: ${Containers.SINGLE_ITEM_SIZE}px;`,
              hexpand: true,
              vexpand: true,
            }),
            overlays: [
              Widget.Box({
                className: "AvalanchePanelDashboardItemNetworkInfo wired",
                vertical: true,
                hexpand: true,
                vexpand: true,
                vpack: "start",
                hpack: "start",
                children: [
                  Widget.Label({
                    className: "AvalanchePanelDashboardItemNetworkInfoTitle",
                    hpack: "start",
                    label: "WIRED",
                  }),
                ],
              }),
              Widget.Box({
                className: "AvalanchePanelDashboardItemNetworkInfoBody wired",
                vertical: true,
                vpack: "center",
                hexpand: true,
                vexpand: false,
                children: [
                  Widget.Box({
                    className: `AvalanchePanelDashboardItemNetworkInfoIcon ${n.connected ? "connected" : "disconnected"}`,
                    halign: Gtk.Align.CENTER,
                    child: Widget.Label({
                      label: n.icon,
                    }),
                  }),

                  Widget.Label({
                    className:
                      "AvalanchePanelDashboardItemNetworkInfoBandwidth",
                    halign: Gtk.Align.CENTER,
                    label: Stats.NetworkBandwidthTX.bind().as(
                      (bandwidth) => `󰅧   ${humanBytes(bandwidth)}`,
                    ),
                  }),
                  Widget.Label({
                    className:
                      "AvalanchePanelDashboardItemNetworkInfoBandwidth",
                    halign: Gtk.Align.CENTER,
                    label: Stats.NetworkBandwidthRX.bind().as(
                      (bandwidth) => `󰅢   ${humanBytes(bandwidth)}`,
                    ),
                  }),
                ],
              }),
            ],
          });
        } else {
          return Widget.Overlay({
            className: "AvalanchePanelDashboardItemNetworkInfoOverlay wireless",
            hexpand: true,
            child: Widget.Box({
              css: `min-width: ${Containers.SINGLE_ITEM_SIZE}px; min-height: ${Containers.SINGLE_ITEM_SIZE}px;`,
              hexpand: true,
              vexpand: true,
            }),
            overlays: [
              Widget.Box({
                className: "AvalanchePanelDashboardItemNetworkInfo wireless",
                vertical: true,
                hexpand: true,
                vexpand: true,
                vpack: "start",
                hpack: "start",
                children: [
                  Widget.Label({
                    className: "AvalanchePanelDashboardItemNetworkInfoTitle",
                    hpack: "start",
                    label: n.ssid || "WIRELESS",
                  }),
                ],
              }),
              Widget.Box({
                className:
                  "AvalanchePanelDashboardItemNetworkInfoBody wireless",
                vertical: true,
                vpack: "center",
                hexpand: true,
                vexpand: false,
                children: [
                  Widget.Box({
                    className: `AvalanchePanelDashboardItemNetworkInfoIcon ${n.connected ? "connected" : "disconnected"}`,
                    halign: Gtk.Align.CENTER,
                    child: Widget.Label({
                      label: n.icon,
                    }),
                  }),
                  Widget.Label({
                    className:
                      "AvalanchePanelDashboardItemNetworkInfoBandwidth",
                    halign: Gtk.Align.CENTER,
                    label: Stats.NetworkBandwidthTX.bind().as(
                      (bandwidth) => `󰅧   ${humanBytes(bandwidth)}`,
                    ),
                  }),
                  Widget.Label({
                    className:
                      "AvalanchePanelDashboardItemNetworkInfoBandwidth",
                    halign: Gtk.Align.CENTER,
                    label: Stats.NetworkBandwidthRX.bind().as(
                      (bandwidth) => `󰅢   ${humanBytes(bandwidth)}`,
                    ),
                  }),
                ],
              }),
            ],
          });
        }
      }),
    }),
  });
};
