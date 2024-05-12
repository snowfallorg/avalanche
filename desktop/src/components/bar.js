import * as Settings from "../util/settings.js";
import * as Windows from "../util/windows.js";
import * as Panel from "./panel.js";
import * as Notifications from "./notifications.js";
import * as Dashboard from "./bar/dashboard.js";
import * as Workspaces from "./bar/workspaces.js";
import * as Volume from "./bar/volume.js";
import * as Bluetooth from "./bar/bluetooth.js";
import * as Network from "./bar/network.js";
import * as Battery from "./bar/battery.js";
import * as Time from "./bar/time.js";
// import * as Tray from "./bar/tray.js";

const settings = Settings.load();

export const create = ({ monitor }) => {
	const view = Variable("");

	const top = [];
	const bottom = [];

	if (settings.bar.dashboard.enable) {
		top.push(Dashboard.create({ view }));
	}

	if (settings.bar.workspaces.enable) {
		top.push(Workspaces.create({ monitor }));
	}

	if (settings.bar.volume.enable) {
		bottom.push(Volume.create({ view }));
	}

	if (settings.bar.bluetooth.enable) {
		bottom.push(Bluetooth.create({ view }));
	}

	if (settings.bar.network.enable) {
		bottom.push(Network.create({ view }));
	}

	if (settings.bar.battery.enable) {
		bottom.push(Battery.create({ view }));
	}

	if (settings.bar.time.enable) {
		bottom.push(Time.create({ view }));
	}

	const bar = Windows.create(monitor, {
		name: `avalanche-bar-${monitor.name}-${monitor.id}`,
		className: "AvalancheBar",
		exclusivity: "exclusive",
		layer: "top",
		anchor: ["top", "left", "bottom"],
		widthRequest: settings.bar.width,
		canFocus: false,
		child: Widget.CenterBox({
			className: "AvalancheBarContent",
			vertical: true,
			startWidget: Widget.Box({
				className: "AvalancheBarStart",
				vpack: "start",
				vertical: true,
				spacing: 16,
				children: top,
			}),
			endWidget: Widget.Box({
				className: "AvalancheBarEnd",
				vpack: "end",
				vertical: true,
				spacing: 4,
				children: bottom,
			}),
		}),
		setup: (self) => {
			self.keybind("Escape", () => {
				App.quit();
			});
		},
	});

	const panel = Panel.create({ monitor, view });

	const notifications = Notifications.create({ monitor });

	// @ts-expect-error
	bar.panel = panel;

	// @ts-expect-error
	bar.view = view;

	// @ts-expect-error
	bar.notifications = notifications;

	return bar;
};

export const populate = (monitors, bars) => {
	for (const monitor of monitors) {
		if (bars.has(monitor.name)) {
			continue;
		}

		const bar = create({ monitor });

		// @ts-expect-error
		if (bar.panel) {
			// @ts-expect-error
			Windows.add(bar.panel.name, bar.panel);
		}

		// @ts-expect-error
		if (bar.notifications) {
			// @ts-expect-error
			Windows.add(bar.notifications.name, bar.notifications);
		}

		bars.set(monitor.name, bar);
		Windows.add(bar.name, bar);
	}
};

// BUG: This functionality is currently broken due to issues with Ags. For some reason only removing
// unused bars and then repopulating results in an error and the newly created bars get the wrong monitor.
export const prune = (monitors, bars) => {
	for (const [name, bar] of bars) {
		if (!monitors.find((monitor) => monitor.name === name)) {
			bars.delete(name);
			Windows.remove(name);

			if (bar.panel) {
				Windows.remove(bar.panel.name);
			}

			if (bar.notifications) {
				Windows.remove(bar.notifications.name);
			}
		}
	}
};

export const clear = (bars) => {
	for (const [name, bar] of bars) {
		bars.delete(name);
		Windows.remove(name);
	}
};
