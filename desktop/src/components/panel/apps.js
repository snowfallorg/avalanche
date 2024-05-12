import * as Settings from "../../util/settings.js";
const Applications = await Service.import("applications");

const settings = Settings.load();

const AppButton = ({ app, view }) => {
  let icon;

  switch (app["icon-name"]) {
    case "nix-snowflake":
      icon = Widget.Label({
        className: "AvalanchePanelAppIcon text",
        label: "󱄅",
      });
      break;
    default:
      icon = Widget.Icon({
        className: "AvalanchePanelAppIcon",
        icon: app["icon-name"],
      });
      break;
  }
  const button = Widget.Button({
    name: `avalanche-panel-app-${app.name}`,
    className: "AvalanchePanelApp",
    cursor: "pointer",
    onPrimaryClick: () => {
      // This will launch the program as a child of the desktop shell. If the shell
      // dies then every program started this way will be killed. Instead, we want to
      // spawn new processes separate from the desktop shell via bash.
      // app.launch();
      const command = app.executable.replaceAll(/%\S/g, "");
      Utils.execAsync(["bash", "-c", `${command} &`]);

      view.value = "";
    },
    child: Widget.Box({
      spacing: 8,
      children: [
        icon,
        Widget.Label({
          className: "AvalanchePanelAppName",
          label: app.name,
        }),
      ],
    }),
  });

  // @ts-expect-error
  button.app = app;

  return button;
};

export const create = ({ view }) => {
  const list = Widget.Box({
    className: "AvalanchePanelAppsList",
    vertical: true,
    spacing: 8,
  });

  const scrollable = Widget.Scrollable({
    hscroll: "never",
    vscroll: "automatic",
    vexpand: true,
    child: list,
  });

  const entry = Widget.Entry({
    className: "AvalanchePanelAppsSearchEntry",
    placeholderText: "Search...",
    hexpand: true,
    setup: (self) => {
      self.hook(App, () => {
        if (self.visible) {
          self.grab_focus();
        }
      });
    },
    onChange: (self) => {
      const text = self.text?.toLowerCase().trim() ?? "";

      if (text === "") {
        for (const child of list.children) {
          child.visible = true;
        }
      } else {
        for (const child of list.children) {
          // @ts-expect-error
          const app = child.app;

          if (app) {
            const name = app.name?.toLowerCase() ?? "";
            const description = app.description?.toLowerCase() ?? "";
            child.visible = name.includes(text) || description.includes(text);
          }
        }
      }
    },
    onAccept: (self) => {
      for (const child of list.children) {
        if (child.visible) {
          // @ts-expect-error
          const app = child.app;

          if (app) {
            const command = app.executable.replaceAll(/%\S/g, "");
            Utils.execAsync(["bash", "-c", `${command} &`]);
          }

          break;
        }
      }

      view.value = "";
    },
  });

  const search = Widget.Box({
    className: "AvalanchePanelAppsSearch",
    hexpand: true,
    vpack: "center",
    css: `min-height: ${settings.bar.width}px;`,
    children: [
      entry,
      Widget.Label({
        className: "AvalanchePanelAppsSearchIcon",
        label: "󱁴",
      }),
    ],
  });

  const widget = Widget.Box({
    className: "AvalanchePanelApps",
    vertical: true,
    hexpand: true,
    vexpand: true,
    children: [search, scrollable],
    setup: (self) => {
      let apps = Applications.query("");

      if (settings.panel.apps.sort) {
        apps.sort((a, b) => a.name.localeCompare(b.name));
      }

      for (const app of apps) {
        list.add(AppButton({ app, view }));
      }

      const children = list.get_children();
      if (children[0]) {
        children[0].grab_focus();
      }
    },
  });

  return widget;
};
