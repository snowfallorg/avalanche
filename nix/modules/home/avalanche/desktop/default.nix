{ lib
, pkgs
, config
, ...
}:
let
  cfg = config.snowfallorg.avalanche.desktop;

  inherit (lib.snowfallorg) colors;

  create-binding-option = action: modifiers: key: {
    modifiers = lib.mkOption {
      default = modifiers;
      description = "Key modifiers to ${action}.";
      type = lib.types.listOf lib.types.str;
    };

    key = lib.mkOption {
      default = key;
      description = "Key to ${action}.";
      type = lib.types.str;
    };
  };

  render-binding = binding: action:
    let
      modifiers = builtins.concatStringsSep " " binding.modifiers;
    in
    "${modifiers}, ${binding.key}, ${action}";

  format = pkgs.formats.json { };

  config-json = format.generate "desktop.json" cfg.settings;

  dynamic-wallpaper-configs =
    lib.snowfall.attrs.map-concat-attrs-to-list
      (
        name: monitor-config: ''
          preload = ${monitor-config.wallpaper}
          wallpaper = ${monitor-config.name}, ${monitor-config.wallpaper}
        ''
      )
      cfg.monitors;

  wallpaper-config =
    ''
      splash = false
    ''
    + builtins.concatStringsSep "\n" dynamic-wallpaper-configs;

  monitor-configs =
    lib.snowfall.attrs.map-concat-attrs-to-list
      (
        name: monitor-config: "${monitor-config.name}, ${monitor-config.resolution}, ${monitor-config.position}, ${monitor-config.scale}"
      )
      cfg.monitors;
in
{
  options.snowfallorg.avalanche.desktop = {
    enable = lib.mkEnableOption "Avalanche Desktop";

    settings = lib.mkOption {
      default = { };
      description = "Avalanche Desktop settings";

      type = lib.types.submodule {
        freeformType = format.type;
      };
    };

    monitors = lib.mkOption {
      default = { };
      description = "Avalanche Desktop monitors";
      type = lib.types.attrsOf (lib.types.submodule ({ name, ... }: {
        options = {
          enable = lib.mkOption {
            default = true;
            description = "Enable monitor";
            type = lib.types.bool;
          };

          name = lib.mkOption {
            default = name;
            description = "Monitor name";
            type = lib.types.str;
          };

          resolution = lib.mkOption {
            default = "preferred";
            description = "Monitor resolution";
            type = lib.types.str;
          };

          position = lib.mkOption {
            default = "auto";
            description = "Monitor position";
            type = lib.types.str;
          };

          scale = lib.mkOption {
            default = "1";
            description = "Monitor scale";
            type = lib.types.str;
          };

          wallpaper = lib.mkOption {
            default = pkgs.snowfallorg.avalanche-wallpapers.nord-rainbow-dark-nix;
            description = "Monitor wallpaper";
            type = lib.types.oneOf [ lib.types.str lib.types.path ];
          };

          clamshell = lib.mkOption {
            default = false;
            description = "Whether this monitor should be disabled based on lid state.";
          };
        };
      }));
    };

    bindings = {
      modifier = lib.mkOption {
        default = "SUPER";
        description = "Modifier key";
        type = lib.types.str;
      };

      session = {
        exit = create-binding-option "exit hyprland" [ "$mod" "SHIFT" ] "q";
        reload = create-binding-option "reload hyprland" [ "$mod" "Control_L" "SHIFT" ] "r";
      };

      shell = {
        apps = create-binding-option "open apps" [ "$mod" ] "a";
        dashboard = create-binding-option "open dashboard" [ "$mod" ] "d";
        restart = create-binding-option "restart shell" [ "$mod" "SHIFT" ] "r";
      };

      windows = {
        open-terminal = create-binding-option "open terminal" [ "$mod" ] "t";
        close = create-binding-option "close window" [ "$mod" ] "q";
        float = create-binding-option "toggle floating" [ "$mod" ] "Space";
        pin = create-binding-option "toggle pin" [ "$mod" ] "s";
        fullscreen = create-binding-option "toggle fullscreen" [ "$mod" ] "f";
        fake-fullscreen = create-binding-option "toggle fake fullscreen" [ "$mod" "SHIFT" ] "f";

        focus = {
          left = create-binding-option "focus left" [ "$mod" ] "h";
          up = create-binding-option "focus up" [ "$mod" ] "k";
          down = create-binding-option "focus down" [ "$mod" ] "j";
          right = create-binding-option "focus right" [ "$mod" ] "l";
        };

        move = {
          left = create-binding-option "move left" [ "$mod" "SHIFT" ] "h";
          up = create-binding-option "move up" [ "$mod" "SHIFT" ] "k";
          down = create-binding-option "move down" [ "$mod" "SHIFT" ] "j";
          right = create-binding-option "move right" [ "$mod" "SHIFT" ] "l";
        };
      };

      workspace = {
        switch = {
          "1" = create-binding-option "switch to workspace 1" [ "$mod" ] "1";
          "2" = create-binding-option "switch to workspace 2" [ "$mod" ] "2";
          "3" = create-binding-option "switch to workspace 3" [ "$mod" ] "3";
          "4" = create-binding-option "switch to workspace 4" [ "$mod" ] "4";
          "5" = create-binding-option "switch to workspace 5" [ "$mod" ] "5";
          "6" = create-binding-option "switch to workspace 6" [ "$mod" ] "6";
          "7" = create-binding-option "switch to workspace 7" [ "$mod" ] "7";
          "8" = create-binding-option "switch to workspace 8" [ "$mod" ] "8";
          "9" = create-binding-option "switch to workspace 9" [ "$mod" ] "9";
          "10" = create-binding-option "switch to workspace 10" [ "$mod" ] "0";
        };

        move = {
          "1" = create-binding-option "move window to workspace 1" [ "$mod" "SHIFT" ] "1";
          "2" = create-binding-option "move window to workspace 2" [ "$mod" "SHIFT" ] "2";
          "3" = create-binding-option "move window to workspace 3" [ "$mod" "SHIFT" ] "3";
          "4" = create-binding-option "move window to workspace 4" [ "$mod" "SHIFT" ] "4";
          "5" = create-binding-option "move window to workspace 5" [ "$mod" "SHIFT" ] "5";
          "6" = create-binding-option "move window to workspace 6" [ "$mod" "SHIFT" ] "6";
          "7" = create-binding-option "move window to workspace 7" [ "$mod" "SHIFT" ] "7";
          "8" = create-binding-option "move window to workspace 8" [ "$mod" "SHIFT" ] "8";
          "9" = create-binding-option "move window to workspace 9" [ "$mod" "SHIFT" ] "9";
          "10" = create-binding-option "move window to workspace 10" [ "$mod" "SHIFT" ] "0";
        };

        move-silent = {
          "1" = create-binding-option "move window to workspace 1 silently" [ "$mod" "Control_L" "SHIFT" ] "1";
          "2" = create-binding-option "move window to workspace 2 silently" [ "$mod" "Control_L" "SHIFT" ] "2";
          "3" = create-binding-option "move window to workspace 3 silently" [ "$mod" "Control_L" "SHIFT" ] "3";
          "4" = create-binding-option "move window to workspace 4 silently" [ "$mod" "Control_L" "SHIFT" ] "4";
          "5" = create-binding-option "move window to workspace 5 silently" [ "$mod" "Control_L" "SHIFT" ] "5";
          "6" = create-binding-option "move window to workspace 6 silently" [ "$mod" "Control_L" "SHIFT" ] "6";
          "7" = create-binding-option "move window to workspace 7 silently" [ "$mod" "Control_L" "SHIFT" ] "7";
          "8" = create-binding-option "move window to workspace 8 silently" [ "$mod" "Control_L" "SHIFT" ] "8";
          "9" = create-binding-option "move window to workspace 9 silently" [ "$mod" "Control_L" "SHIFT" ] "9";
          "10" = create-binding-option "move window to workspace 10 silently" [ "$mod" "Control_L" "SHIFT" ] "0";
        };
      };
    };

    programs = {
      terminal = lib.mkOption {
        type = lib.types.str;
        default = "${lib.getExe pkgs.foot}";
        defaultText = "foot";
        description = "The terminal emulator to use.";
      };
    };

    switches = {
      lid = lib.mkOption {
        type = lib.types.str;
        default = "Lid Switch";
        description = "The name of the switch to watch for lid events.";
      };
    };
  };

  config = lib.mkIf cfg.enable {
    xdg = {
      enable = lib.mkDefault true;
      configFile = {
        "hypr/hyprpaper.conf".text = wallpaper-config;
      };
    };

    home = {
      sessionVariables = {
        # General Wayland environment variables.
        SDL_VIDEODRIVER = "wayland";
        CLUTTER_BACKEND = "wayland";
        GDK_BACKEND = "wayland,x11";
        QT_QPA_PLATFORM = "wayland;xcb";
        QT_WAYLAND_DISABLE_WINDOW_DECORATION = "1";
        NIXOS_OZONE_WL = "1";
        MOZ_ENABLE_WAYLAND = "1";
        _JAVA_AWT_WM_NONEREPARENTING = "1";

        # These are automatically set by Hyprland itself, but it doesn't hurt to provide
        # them in the Nix configuration as well.
        XDG_CURRENT_DESKTOP = "Hyprland";
        XDG_SESSION_DESKTOP = "Hyprland";
        XDG_SESSION_TYPE = "wayland";

        # Shell configuration.
        AVALANCHE_DESKTOP_SETTINGS = config-json;
      };

      packages = [
        pkgs.gnome.nautilus
      ];
    };

    qt = {
      enable = true;
      platformTheme = "gtk3";
    };

    wayland = {
      windowManager.hyprland = {
        enable = true;

        xwayland.enable = true;

        settings = {
          "$mod" = cfg.bindings.modifier;

          general = {
            border_size = lib.mkDefault 2;
            "col.active_border" = lib.mkDefault "0xff${colors.without-hash colors.nord.nord10}";
            "col.inactive_border" = lib.mkDefault "0x00${colors.without-hash colors.nord.nord0}";

            gaps_out = lib.mkDefault 16;
          };

          decoration = {
            rounding = lib.mkDefault 10;
            drop_shadow = lib.mkDefault true;
            shadow_ignore_window = lib.mkDefault false;
            active_opacity = lib.mkDefault 1.0;
            inactive_opacity = lib.mkDefault 1.0;

            blur = {
              enabled = lib.mkDefault false;
            };
          };

          misc = {
            disable_hyprland_logo = lib.mkDefault true;
            disable_splash_rendering = lib.mkDefault true;
          };

          gestures = {
            workspace_swipe = lib.mkDefault true;
          };

          layerrule = [
            # Disable Hyprland animations on the desktop shell.
            "noanim, ^avalanche-"
          ];

          exec-once = [
            # We need to ensure that environment variables are correctly updated and available for
            # any future programs the user launches.
            # NOTE: These may not be needed when configured using the Home Manager module. Hyprland's
            # config may already take care of this when `wayland.windowManager.hyprland.systemd.enable`
            # is set to `true`.
            "dbus-update-activation-environment --systemd WAYLAND_DISPLAY XDG_CURRENT_DESKTOP"
            "systemctl --user import-environment WAYLAND_DISPLAY XDG_CURRENT_DESKTOP"

            "${lib.getExe pkgs.snowfallorg.avalanche-desktop}"
          ];

          bindm = [
            # Super + left click
            "$mod, mouse:272, movewindow"
            # Super + right click
            "$mod, mouse:273, resizewindow"
            # Super + middle click
            "$mod, mouse:274, togglefloating"
          ];

          bind = [
            # Hyprland
            (render-binding cfg.bindings.session.exit "exit")
            (render-binding cfg.bindings.session.reload "forcerendererreload")

            # Shell
            (render-binding cfg.bindings.shell.apps ''exec, ${lib.getExe pkgs.ags} -r "avalanche.active.setView('apps')"'')
            (render-binding cfg.bindings.shell.dashboard ''exec, ${lib.getExe pkgs.ags} -r "avalanche.active.setView('dashboard')"'')
            (render-binding cfg.bindings.shell.restart ''exec, ${lib.getExe pkgs.snowfallorg.avalanche-desktop}'')

            # Programs
            (render-binding cfg.bindings.windows.open-terminal "exec, ${cfg.programs.terminal}")

            # Windows
            (render-binding cfg.bindings.windows.close "killactive")
            (render-binding cfg.bindings.windows.float "killactive")
            (render-binding cfg.bindings.windows.pin "pin")
            (render-binding cfg.bindings.windows.fullscreen "fullscreen, 0")
            (render-binding cfg.bindings.windows.fake-fullscreen "fakefullscreen")
            (render-binding cfg.bindings.windows.focus.left "movefocus, l")
            (render-binding cfg.bindings.windows.focus.up "movefocus, u")
            (render-binding cfg.bindings.windows.focus.down "movefocus, d")
            (render-binding cfg.bindings.windows.focus.right "movefocus, r")
            (render-binding cfg.bindings.windows.move.left "movewindow, l")
            (render-binding cfg.bindings.windows.move.up "movewindow, u")
            (render-binding cfg.bindings.windows.move.down "movewindow, d")
            (render-binding cfg.bindings.windows.move.right "movewindow, r")

            # Workspaces
            (render-binding cfg.bindings.workspace.switch."1" "workspace, 1")
            (render-binding cfg.bindings.workspace.switch."2" "workspace, 2")
            (render-binding cfg.bindings.workspace.switch."3" "workspace, 3")
            (render-binding cfg.bindings.workspace.switch."4" "workspace, 4")
            (render-binding cfg.bindings.workspace.switch."5" "workspace, 5")
            (render-binding cfg.bindings.workspace.switch."6" "workspace, 6")
            (render-binding cfg.bindings.workspace.switch."7" "workspace, 7")
            (render-binding cfg.bindings.workspace.switch."8" "workspace, 8")
            (render-binding cfg.bindings.workspace.switch."9" "workspace, 9")
            (render-binding cfg.bindings.workspace.switch."10" "workspace, 10")
            (render-binding cfg.bindings.workspace.move."1" "movetoworkspace, 1")
            (render-binding cfg.bindings.workspace.move."2" "movetoworkspace, 2")
            (render-binding cfg.bindings.workspace.move."3" "movetoworkspace, 3")
            (render-binding cfg.bindings.workspace.move."4" "movetoworkspace, 4")
            (render-binding cfg.bindings.workspace.move."5" "movetoworkspace, 5")
            (render-binding cfg.bindings.workspace.move."6" "movetoworkspace, 6")
            (render-binding cfg.bindings.workspace.move."7" "movetoworkspace, 7")
            (render-binding cfg.bindings.workspace.move."8" "movetoworkspace, 8")
            (render-binding cfg.bindings.workspace.move."9" "movetoworkspace, 9")
            (render-binding cfg.bindings.workspace.move."10" "movetoworkspace, 10")
            (render-binding cfg.bindings.workspace.move-silent."1" "movetoworkspacesilent, 1")
            (render-binding cfg.bindings.workspace.move-silent."2" "movetoworkspacesilent, 2")
            (render-binding cfg.bindings.workspace.move-silent."3" "movetoworkspacesilent, 3")
            (render-binding cfg.bindings.workspace.move-silent."4" "movetoworkspacesilent, 4")
            (render-binding cfg.bindings.workspace.move-silent."5" "movetoworkspacesilent, 5")
            (render-binding cfg.bindings.workspace.move-silent."6" "movetoworkspacesilent, 6")
            (render-binding cfg.bindings.workspace.move-silent."7" "movetoworkspacesilent, 7")
            (render-binding cfg.bindings.workspace.move-silent."8" "movetoworkspacesilent, 8")
            (render-binding cfg.bindings.workspace.move-silent."9" "movetoworkspacesilent, 9")
            (render-binding cfg.bindings.workspace.move-silent."10" "movetoworkspacesilent, 10")
          ];

          bindl =
            let
              clamshell-monitors =
                lib.filterAttrs
                  (key: value: value.clamshell)
                  cfg.monitors;

              clamshell-monitors-bindings =
                lib.snowfall.attrs.map-concat-attrs-to-list
                  (
                    name: monitor-config: [
                      '', switch:on:${cfg.switches.lid}, exec, hyprctl keyword monitor "${monitor-config.name}, disable"''
                      '', switch:off:${cfg.switches.lid}, exec, hyprctl keyword monitor "${monitor-config.name}, ${monitor-config.resolution}, ${monitor-config.position}, ${monitor-config.scale}"''
                    ]
                  )
                  clamshell-monitors;
            in
            clamshell-monitors-bindings;
        };
      };
    };

    services = {
      gnome-keyring.enable = true;
    };

    systemd.user.services = {
      hyprpaper = {
        Unit = {
          Description = "Hyprland wallpaper daemon";
          PartOf = [ "graphical-session.target" ];
        };

        Service = {
          ExecStart = lib.getExe pkgs.hyprpaper;
          Restart = "on-failure";
        };

        Install = {
          WantedBy = [ "graphical-session.target" ];
        };
      };
    };

    snowfallorg.avalanche.desktop = {
      monitors.default = {
        name = lib.mkDefault "";
      };
    };
  };
}
