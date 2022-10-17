import { $plugin } from '@hykord/hooks';
import { waitFor, Filters } from '@hykord/webpack';
import { after } from '@hykord/patcher';
import { Logger as RealLogger } from '@common';
import { Settings as SettingsApi } from '@hykord/apis';

const Logger = new RealLogger('Settings API');

let unpatch: () => void;
export default $plugin({
  name: 'Settings API',
  author: 'Hykord',
  version: '0.0.0',
  description: 'API for injecting content into settings',
  $toggleable: false,
  $internal: true,
  async start(): Promise<void> {
    const Settings: any = await waitFor(Filters.byProtos('getPredicateSections'));

    unpatch = after('getPredicateSections', Settings.prototype, (_, sects) => {
        const location = sects.findIndex((c: any) => c.section.toLowerCase() === 'friend requests') + 1;
  
        if (location) {
          sects.splice(
            location,
            0,
            { section: 'DIVIDER' },
            { section: 'HEADER', label: 'Hykord' },
            ...SettingsApi.sections,
          );
        }
  
        return sects;
    });

    Logger.info('Plugin successfully injected everything needed');
  },
  stop(): void {
    unpatch?.();
  }
});
