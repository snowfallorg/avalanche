{
  mkShell,
  writeShellScriptBin,
  ags,
  sassc,
  gjs,
  gtk3,
  libpulseaudio,
  upower,
  gnome,
  gtk-layer-shell,
  glib-networking,
  networkmanager,
  libdbusmenu-gtk3,
  gvfs,
  libsoup_3,
  libnotify,
  pam,
  sysstat,
}: let
  link-ags-types = writeShellScriptBin "link-ags-types" ''
    if [ -e ./flake.nix ]; then
      rm -rf ./desktop/types
      ln -sf ${ags}/share/com.github.Aylur.ags/types ./desktop/
    else
      echo "This script must be run from the root of the flake";
    fi
  '';
in
  mkShell {
    packages = [
      ags
      sassc
      gjs
      gtk3
      libpulseaudio
      upower
      gnome.gnome-bluetooth
      gtk-layer-shell
      glib-networking
      networkmanager
      libdbusmenu-gtk3
      gvfs
      libsoup_3
      libnotify
      pam

      sysstat
      link-ags-types
    ];

    shellHook = ''
      if ! [ -e ./desktop/types ]; then
        echo "The AGS types are not linked. Run 'link-ags-types' to link them."
      else
        echo "Using existing AGS types. Run 'link-ags-types' to update them."
      fi
    '';
  }
