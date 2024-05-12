{
  lib,
  pkgs,
  config,
  inputs,
  ...
}: let
  cfg = config.snowfallorg.avalanche.desktop;
in {
  options.snowfallorg.avalanche.desktop = {
    enable = lib.mkEnableOption "Avalanche Desktop";
  };

  config = lib.mkIf cfg.enable {
    programs = {
      dconf = {
        enable = true;
      };
    };

    services = {
      upower.enable = true;

      dbus = {
        packages = [pkgs.gcr];
      };
    };

    # TODO: Move this to the home-manager module once 24.05 is out.
    xdg = {
      portal = {
        xdgOpenUsePortal = lib.mkDefault true;

        extraPortals = [
          pkgs.xdg-desktop-portal-gtk
        ];
      };
    };

    home-manager.sharedModules = [
      inputs.self.homeModules."avalanche/desktop"

      {
        _file = "virtual:snowfallorg/avalanche/desktop/enable";
        config = {
          snowfallorg.avalanche.desktop.enable = true;
        };
      }
    ];
  };
}
