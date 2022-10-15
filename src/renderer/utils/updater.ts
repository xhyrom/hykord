export let changes: Record<'hash' | 'author' | 'message', string>[] = [];

export const checkForUpdates = async () => {
  const updates = await HykordNative.getManagers().getUpdater().checkForUpdates();
  changes = updates;

  return updates.length > 0;
};

export const downloadUpdate = async () => {
  await HykordNative.getManagers().getUpdater().downloadUpdate();

  // TODO: make alert
};

export const isOutdated = () => changes.length > 0;
