const Bluetooth = await Service.import("bluetooth");

export const create = ({ view }) => {
  const label = Widget.Label({
    className: "AvalancheBarBluetoothIcon",
    label: "󰂯",
    setup: (self) => {
      self.hook(Bluetooth, () => {
        if (Bluetooth.enabled) {
          self.label = "󰂯";
          self.class_name = "AvalancheBarBluetoothIcon enabled";
        } else {
          self.label = "󰂲";
          self.class_name = "AvalancheBarBluetoothIcon disabled";
        }
      });
    },
  });

  const widget = Widget.EventBox({
    className: "AvalancheBarBluetooth",
    child: label,
    hpack: "center",
    onSecondaryClick: () => {
      Bluetooth.enabled = !Bluetooth.enabled;
    },
  });

  return widget;
};
