const SystemTray = await Service.import("systemtray");

export const create = () => {
  const widget = Widget.Box({
    vertical: true,
    children: SystemTray.bind("items").as((items) => {
      return items.map((item) => {
        return Widget.Button({
          className: "AvalancheBarTrayItem",
          child: Widget.Icon({
            icon: item.icon,
          }),
          onPrimaryClick: () => {
            // console.log(item);
          },
        });
      });
    }),
  });

  return widget;
};
