import { session } from 'electron';

export const remove = () => {
  session.defaultSession.webRequest.onHeadersReceived(
    ({ responseHeaders }, callback) => {
      const headers = Object.keys(responseHeaders);

      for (let i = 0; i < headers.length; i++) {
        const key = headers[i];
        if (key.toLowerCase().indexOf('content-security-policy') !== 0)
          continue;
        delete responseHeaders[key];
      }

      callback({ cancel: false, responseHeaders: responseHeaders });
    },
  );
};

export default {
  remove,
};
