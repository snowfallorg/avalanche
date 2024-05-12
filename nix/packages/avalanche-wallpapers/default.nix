{
  lib,
  runCommandNoCC,
  ...
}: let
  wallpapers-directory = lib.snowfall.fs.get-file "desktop/wallpapers";
  images = lib.snowfall.fs.get-files wallpapers-directory;

  wallpapers =
    builtins.map (
      image: let
        file-name = builtins.baseNameOf image;
        name = lib.snowfall.path.get-file-name-without-extension file-name;
      in
        runCommandNoCC "wallpaper-${name}" {
          passthru = {
            inherit file-name;
            attr-name = name;
          };
        } ''
          cp ${image} $out
        ''
    )
    images;

  install-wallpapers =
    lib.concatMapStringsSep "\n"
    (image: "cp ${image} $out/${image.passthru.file-name}")
    wallpapers;

  all-wallpapers =
    runCommandNoCC "avalanche-wallpapers"
    {
      passthru =
        lib.foldl (all-wallpapers: wallpaper:
          all-wallpapers
          // {
            ${wallpaper.attr-name} = wallpaper;
          })
        {}
        wallpapers;
    }
    ''
      mkdir -p $out

      ${install-wallpapers}
    '';
in
  all-wallpapers
