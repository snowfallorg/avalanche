const NotificationIcon = (notification) => {
  if (notification.image) {
    return Widget.Box({
      className: "AvalancheNotificationItemIcon image",
      hpack: "start",
      vpack: "start",
      css: `background-image: url("${notification.image}"); background-size: contain; background-repeat: no-repeat; background-position: center;`,
    });
  }

  let className = "AvalancheNotificationItemIcon";
  let icon = null;

  if (Utils.lookUpIcon(notification.app_icon)) {
    icon = notification.app_icon;
    className += " app-icon";
  }

  if (notification.app_entry && Utils.lookUpIcon(notification.app_entry)) {
    icon = notification.app_entry;
    className += " app-entry";
  }

  if (icon !== null) {
    return Widget.Box({
      className: "AvalancheNotificationItemIcon",
      hpack: "start",
      vpack: "start",
      child: Widget.Box({
        className: "AvalancheNotificationItemIconContent",
        vpack: "center",
        hpack: "center",
        vexpand: true,
        hexpand: true,
        child: Widget.Icon({
          hpack: "center",
          vpack: "center",
          icon: icon,
          size: 48,
        }),
      }),
    });
  }
};

export const create = (notification) => {
  const top = [
    Widget.Box({
      className: "AvalancheNotificationItemText",
      hpack: "start",
      vpack: "start",
      vertical: true,
      hexpand: true,
      children: [
        Widget.Label({
          className: "AvalancheNotificationItemTitle",
          label: notification.summary,
          hpack: "start",
          hexpand: true,
          wrap: true,
          useMarkup: true,
          maxWidthChars: 24,
          truncate: "end",
          xalign: 0,
        }),
        Widget.Label({
          className: "AvalancheNotificationItemBody",
          label: notification.body,
          wrap: true,
          // useMarkup: true,
          justification: "left",
          xalign: 0,
        }),
      ],
    }),
  ];

  const icon = NotificationIcon(notification);

  if (icon) {
    // @ts-expect-error
    top.unshift(icon);
  }

  const sections = [
    Widget.Box({
      className: "AvalancheNotificationItemTop",
      spacing: 16,
      hexpand: true,
      children: top,
    }),
  ];

  if (notification.actions.length > 0) {
    const actions = Widget.Box({
      className: "AvalancheNotificationItemActions",
      spacing: 8,
      children: notification.actions.map((action) => {
        const button = Widget.Button({
          className: "AvalancheNotificationItemAction",
          label: action.label,
          hexpand: true,
          cursor: "pointer",
          onPrimaryClick: () => {
            notification.invoke(action.id);
            notification.dismiss();
          },
        });

        return button;
      }),
    });

    // @ts-expect-error
    sections.push(actions);
  }

  const widget = Widget.EventBox({
    className: `AvalancheNotificationItem ${notification.urgency}`,
    attribute: {
      id: notification.id,
    },
    onPrimaryClick: () => {
      notification.dismiss();
    },
    child: Widget.Box({
      className: "AvalancheNotificationItemContent",
      vertical: true,
      hexpand: true,
      spacing: 16,
      children: sections,
    }),
  });

  return widget;
};
