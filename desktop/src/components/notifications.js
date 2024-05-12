import * as Windows from "../util/windows.js";
import * as Settings from "../util/settings.js";
import * as NotificationItem from "./notifications/item.js";

const Notifications = await Service.import("notifications");
const Hyprland = await Service.import("hyprland");

const settings = Settings.load();

Notifications.popupTimeout = 8_000;
Notifications.cacheActions = false;
Notifications.forceTimeout = true;

export const create = ({ monitor }) => {
	const list = Widget.Box({
		className: "AvalancheNotificationsList",
		vertical: true,
		spacing: 16,
		children: [
			// There is a but where the last item in the list will be clipped. In order to
			// work around this, we add a 1 pixel tall item to the end of the list.
			Widget.Box({
				className: "AvalancheNotificationsListSpacer",
			}),
		],
	});

	const handleNotified = (_, id) => {
		const notification = Notifications.getNotification(id);

		if (notification && monitor.id === Hyprland.active.monitor.id) {
			// @ts-expect-error
			list.children = [NotificationItem.create(notification), ...list.children];
		}

		if (list.children.length > 0) {
			window.show();
		}
	};

	const handleDismissed = (_, id) => {
		// @ts-expect-error
		const child = list.children.find((child) => child.attribute.id === id);

		if (child) {
			child.destroy();
		}

		if (list.children.length === 0) {
			window.hide();
		}
	};

	list.hook(Notifications, handleNotified, "notified");
	list.hook(Notifications, handleDismissed, "dismissed");

	const window = Windows.create(monitor, {
		name: `avalanche-notifications-${monitor.name}-${monitor.id}`,
		className: "AvalancheNotifications",
		exclusivity: "ignore",
		layer: "overlay",
		anchor: ["top", "right"],
		child: Widget.Box({
			className: "AvalancheNotificationsContent",
			css: `margin-top: ${settings.notifications.gap.outer}; margin-right: ${settings.notifications.gap.outer};`,
			vertical: true,
			child: list,
		}),
	});

	return window;
};
