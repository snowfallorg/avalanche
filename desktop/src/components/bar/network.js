import * as Binding from "../../util/binding.js";

const Network = await Service.import("network");

export const wireless = Utils.merge(
  [
    Network.wifi.bind("enabled"),
    Network.wifi.bind("internet"),
    Network.wifi.bind("state"),
    Network.wifi.bind("strength"),
    Network.wifi.bind("ssid"),
    Network.wifi.bind("access_points"),
  ],
  (enabled, internet, state, strength, ssid) => {
    return {
      enabled,
      internet,
      state,
      strength,
      ssid,
    };
  },
);

export const wired = Utils.merge(
  [Network.wired.bind("state"), Network.wired.bind("internet")],
  (state, internet) => {
    return {
      state,
      internet,
    };
  },
);

export const getWifiIcon = (strength) => {
  if (strength === "bad") {
    return "󰤯";
  }
  if (strength === "weak") {
    return "󰤟";
  }
  if (strength === "good") {
    return "󰤢";
  }
  if (strength === "strong") {
    return "󰤥";
  }
  return "󰤨";
};

export const getWifiStrength = (strength) => {
  if (strength < 20) {
    return "bad";
  }
  if (strength < 40) {
    return "weak";
  }
  if (strength < 60) {
    return "good";
  }
  if (strength < 80) {
    return "strong";
  }
  return "excellent";
};

export const network = Utils.merge(
  [Network.bind("primary"), wireless, wired],
  (primary, wireless, wired) => {
    if (primary === "wired") {
      // Wired connection
      return {
        type: "wired",
        connected: wired.internet === "connected",
        icon: wired.internet === "connected" ? "󰈀" : "󱘖",
      };
    } else if (primary === "wifi") {
      // Wireless connection
      const strength = getWifiStrength(wireless.strength);
      return {
        type: "wireless",
        connected: wireless.internet === "connected",
        icon: getWifiIcon(strength),
        strength,
        ssid: wireless.ssid,
      };
    } else {
      // No wireless and currently disconnected
      return {
        type: "wired",
        connected: false,
        icon: "󱘖",
      };
    }
  },
);

export const create = ({ view }) => {
  const widget = Widget.Box({
    className: "AvalancheBarNetwork",
    hpack: "center",
    child: Widget.Label({
      label: Binding.as(network, (network) => network.icon),
      setup: (self) => {
        self.hook(network.emitter, () => {
          const n = network.emitter.value;

          switch (n.type) {
            case "wired":
              self.class_name = `wired ${
                n.connected ? "connected" : "disconnected"
              }`;
              break;
            case "wireless":
              self.class_name = `wireless ${n.connected ? "connected" : "disconnected"} strength-${n.strength}`;
              break;
          }
        });
      },
    }),
  });

  return widget;
};
