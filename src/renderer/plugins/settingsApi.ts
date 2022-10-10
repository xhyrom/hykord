import { Plugin } from '@hykord/structures';
import { waitFor, Filters } from '@hykord/webpack';
import { after } from '@hykord/patcher';
import { Logger as RealLogger } from '@common';
import { Settings as SettingsApi } from '@hykord/apis';

const Logger = new RealLogger('Settings API');

export class SettingsAPI extends Plugin {
  unpatch: any;

  name = 'Settings API';
  author = 'Hykord';
  version = '0.0.0';
  description = 'API for injecting content into settings';
  $toggleable = false;
  $internal = true;
  public start(): void {
    this.fullStart();
  }

  public async fullStart(): Promise<void> {
    const Settings: any = await waitFor(Filters.byProtos('getPredicateSections'));

    this.unpatch = after('getPredicateSections', Settings.prototype, (_, sects) => {
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
  }

  public stop(): void {
    this.unpatch?.();
  }
}
