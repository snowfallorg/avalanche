{inputs}: final: prev: {
  ags = inputs.ags.packages.${prev.system}.agsWithTypes;
}
