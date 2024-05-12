{
  lib,
  symlinkJoin,
  writeShellScriptBin,
  runCommandNoCC,
  ags,
  sysstat,
  ...
}: let
  src = lib.snowfall.fs.get-file "/desktop/src";

  config =
    runCommandNoCC "avalanche-desktop-assets"
    {
      buildInputs = [ags sysstat];
      src = src;
      name = "snowfall";
    }
    ''
      mkdir -p $out/libexec/avalanche-desktop
      cp -r $src/* $out/libexec/avalanche-desktop/
    '';

  script = writeShellScriptBin "start-avalanche-desktop" ''
    ${lib.getExe ags} --config ${config}/libexec/avalanche-desktop/config.js $@
  '';
in
  symlinkJoin {
    name = "avalance-desktop";
    paths = [config script];
    meta = {
      mainProgram = "start-avalanche-desktop";
    };
  }
