export default (key) =>
  window[
    key ?? Object.keys(window).find((key) => key.startsWith("parcelRequire"))
  ]?.cache;
