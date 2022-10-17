import { $plugin } from '@hykord/hooks';
import { React, waitFor, Filters } from '@hykord/webpack';
import { after } from '@hykord/patcher';
import { Logger as RealLogger } from '@common';
import { Settings as SettingsApi } from '@hykord/apis';

const Logger = new RealLogger('Settings');

let unpatch: () => void;
export default $plugin({
  name: 'Settings',
  author: 'Hykord',
  version:  '0.0.0',
  description: 'Inject hykord specific settings into the settings panel',
  dependsOn: ['Settings API'],
  $toggleable: false,
  $internal: true,
  async start(): Promise<void> {
    import('./utils');
    const userSettings: any = await waitFor(Filters.byProtos('getPredicateSections'));
    
    SettingsApi.registerSection('HYKORD_MAIN', 'Hykord', (await import('./Hykord')).default, 1);
    SettingsApi.registerSection('HYKORD_MAIN_UPDATER', 'Updater', (await import('./Updater')).default, 2);
    SettingsApi.registerSection('HYKORD_MAIN_PLUGINS', 'Plugins', (await import('./Plugins')).default, 3);
    SettingsApi.registerSection('HYKORD_MAIN_THEMES', 'Themes', (await import('./Themes')).default, 4);

    unpatch = after('getPredicateSections', userSettings.prototype, (_, sects) => {
      const debugInfo = sects[sects.findIndex((c: any) => c.section.toLowerCase() === 'custom') + 1];

      if (debugInfo) {
        debugInfo.element = (element => () => {
          const res = element();

          if (res.props.children && res.props.children.length === 4) {
            res.props.children.push(
              ...[['Hykord', `${Hykord.version} (${Hykord.gitHash.slice(0, 7)})`], ...Object.entries(HykordNative.getVersions())].map(([name, value]) => {
                return Object.assign({}, res.props.children[0], {
                  props: Object.assign({}, res.props.children[0].props, {
                    children: [ name, ' ', React.createElement('span', {
                      className: res.props.children[0].props.children[4].props.className,
                      children: [ value ]
                    }) ]
                  })
                })
              })
            );
          }

          return res;
        })(debugInfo.element);
      }

      return sects;
    });

    Logger.info('Plugin successfully injected everything needed');
  },

  stop(): void {
    unpatch?.();
  }
});