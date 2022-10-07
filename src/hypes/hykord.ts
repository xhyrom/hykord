export enum HykordIpcEvents {
  "GET_SETTING_SYNC" = "HYKORD_GET_SETTING_SYNC",
  "GET_SETTING" = "HYKORD_GET_SETTING",
  "SET_SETTING_SYNC" = "HYKORD_SET_SETTING_SYNC",
  "SET_SETTING" = "HYKORD_SET_SETTING",
  "SAVE_SETTINGS" = "HYKORD_SAVE_SETTINGS",
  "RELAUNCH_APP" = "HYKORD_RELAUNCH_APP",
}

export type KnownSettings =
  | "hykord.quick-css"
  | "hykord.react-devtools"
  | "hykord.disable-science-requests"
  | "hykord.unsafe-require";
