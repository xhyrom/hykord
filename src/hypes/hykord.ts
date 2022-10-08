export enum HykordIpcEvents {
  'GET_SETTING_SYNC' = 'HYKORD_GET_SETTING_SYNC',
  'GET_SETTING' = 'HYKORD_GET_SETTING',
  'SET_SETTING_SYNC' = 'HYKORD_SET_SETTING_SYNC',
  'SET_SETTING' = 'HYKORD_SET_SETTING',
  'SAVE_SETTINGS' = 'HYKORD_SAVE_SETTINGS',
  'RELAUNCH_APP' = 'HYKORD_RELAUNCH_APP',

  // Git
  'GET_REPOSITORY' = 'HYKORD_GET_REPOSITORY',
  'GET_LATEST_COMMIT_HASH' = 'HYKORD_GET_LATEST_COMMIT_HASH',
  'CHECK_FOR_UPDATES' = 'HYKORD_CHECK_FOR_UPDATES',
  'DOWNLOAD_UPDATE' = 'HYKORD_DOWNLOAD_UPDATE',
}

export type KnownSettings =
  | 'hykord.quick-css'
  | 'hykord.react-devtools'
  | 'hykord.disable-science-requests'
  | 'hykord.unsafe-require'
  | string;
