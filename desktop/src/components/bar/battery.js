const Battery = await Service.import("battery");

const getBatteryClasses = (isCharging, charge) => {
  return `${isCharging ? "charging" : ""} ${charge <= 20 ? "critical" : ""} ${charge <= 40 ? "warning" : ""}`;
};

const getBatteryIcon = (isCharging, charge) => {
  if (isCharging) {
    return "󰂄";
  }

  if (charge < 20) {
    return "󰂃";
  }

  if (charge < 30) {
    return "󰁻";
  }

  if (charge < 40) {
    return "󰁼";
  }

  if (charge < 50) {
    return "󰁽";
  }

  if (charge < 60) {
    return "󰁾";
  }

  if (charge < 70) {
    return "󰁿";
  }

  if (charge < 80) {
    return "󰂀";
  }

  if (charge < 90) {
    return "󰂁";
  }

  return "󰁹";
};

export const create = ({ view }) => {
  const widget = Widget.EventBox({
    className: "AvalancheBarBattery",
    child: Widget.Label({
      className: "AvalancheBarBatteryIcon",
      label: "󰂑",
      setup: (self) => {
        self.hook(Battery, () => {
          if (Battery.available) {
            const charge = Battery.percent;
            const isCharging = Battery.charging;

            const icon = getBatteryIcon(isCharging, charge);
            const classes = getBatteryClasses(isCharging, charge);

            self.label = icon;
            self.class_name = `AvalancheBarBatteryIcon ${classes}`;
          }
        });
      },
    }),
  });

  return widget;
};
