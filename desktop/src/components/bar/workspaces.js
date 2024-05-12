import * as Settings from "../../util/settings.js";

const Hyprland = await Service.import("hyprland");

const settings = Settings.load();

export const create = ({ monitor }) => {
  const workspaces = Widget.EventBox({
    className: "AvalancheBarWorkspaces",
    onScrollUp: () => {
      const activeWorkspace = Hyprland.monitors.find(
        (m) => m.name === monitor.name,
      )?.activeWorkspace.id;

      if (activeWorkspace == null) {
        return;
      }

      let next = activeWorkspace - 1;

      while (Hyprland.monitors.some((m) => m.activeWorkspace.id === next)) {
        next--;
      }

      if (next < 1) {
        next = settings.bar.workspaces.count;
      }

      Hyprland.messageAsync(`dispatch workspace ${next}`);
    },
    onScrollDown: () => {
      const activeWorkspace = Hyprland.monitors.find(
        (m) => m.name === monitor.name,
      )?.activeWorkspace.id;

      if (activeWorkspace == null) {
        return;
      }

      let next = activeWorkspace + 1;

      while (Hyprland.monitors.some((m) => m.activeWorkspace.id === next)) {
        next++;
      }

      if (next > settings.bar.workspaces.count) {
        next = 1;
      }

      Hyprland.messageAsync(`dispatch workspace ${next}`);
    },
    child: Widget.Box({
      className: "AvalancheBarWorkspacesContent",
      spacing: 8,
      vertical: true,
      hpack: "center",
      vpack: "start",
      children: Array.from(
        { length: settings.bar.workspaces.count },
        (_, i) => {
          const id = i + 1;

          const workspace = Widget.Button({
            className: "AvalancheBarWorkspace",
            cursor: "pointer",
            child: Widget.Box({
              className: "AvalancheBarWorkspaceContent",
              vpack: "fill",
            }),
            onPrimaryClick: () => {
              Hyprland.messageAsync(`dispatch workspace ${id}`);
            },
            setup: (self) => {
              self.hook(Hyprland, () => {
                const isVisible =
                  Hyprland.monitors.find((m) => m.name === monitor.name)
                    ?.activeWorkspace.id === id;
                const isActive =
                  Hyprland.monitors.find((m) => m.activeWorkspace.id === id) !==
                  undefined;

                const isPopulated =
                  (Hyprland.workspaces.find((w) => w.id === id)?.windows ?? 0) >
                  0;

                self.class_name = `AvalancheBarWorkspace ${isActive ? "active" : ""} ${isVisible ? "visible" : ""} ${isPopulated ? "populated" : ""}`;
              });
            },
          });

          return workspace;
        },
      ),
    }),
  });

  return workspaces;
};
