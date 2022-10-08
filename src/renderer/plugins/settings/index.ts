import { Plugin } from '@hykord/structures';
import { React, waitFor, Filters } from '@hykord/webpack';
import { after } from '@hykord/patcher';
import { Logger as RealLogger } from '@common';

const Logger = new RealLogger('Settings');

export class Settings extends Plugin {
  unpatch: any;
  sections: { section: string; label: string; element: any }[] = [];

  name = 'Settings';
  author = 'Hykord';
  version = '0.0.0';
  description = 'Inject hykord specific settings into the settings panel';
  toggleable = false;
  public start(): void {
    this.fullStart();
  }

  public async fullStart(): Promise<void> {
    const userSettings: any = (await this.getSettings());
    
    this.registerSection('HYKORD_MAIN', 'Hykord', (await import('./Hykord')).default);
    this.registerSection('HYKORD_MAIN_UPDATER', 'Updater', (await import('./Updater')).default);
    this.registerSection('HYKORD_MAIN_PLUGINS', 'Plugins', (await import('./Plugins')).default);
    this.registerSection('HYKORD_MAIN_THEMES', 'Themes', (await import('./Themes')).default);

    this.unpatch = after('getPredicateSections', userSettings.prototype, (_, sects) => {
      const changelog = sects.find((c: any) => c.section.toLowerCase() === 'changelog');
      const debugInfo = sects[sects.findIndex((c: any) => c.section.toLowerCase() === 'custom') + 1];

      if (changelog) {
        sects.splice(
          sects.indexOf(changelog) - 1,
          0,
          { section: 'DIVIDER' },
          { section: 'HEADER', label: 'Hykord' },
          ...this.sections,
        );
      }

      if (debugInfo) {
        debugInfo.element = (element => () => {
          const res = element();

          if (res.props.children && res.props.children.length === 4) {
            res.props.children.push(
              ...Object.entries(HykordNative.getVersions()).map(([name, value]) => {
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
  }

  public stop(): void {
    this.unpatch();
  }

  private registerSection(id: string, name: string, component: any) {
    const section = { section: id, label: name, element: component };
    this.sections.push(section);
  
    return () => {
      const i = this.sections.indexOf(section);
      if (i !== -1) this.sections.splice(i, 1);
    };
  }

  private async getSettings() {
    return new Promise((resolve) => {
      waitFor(Filters.byProtos('getPredicateSections'), (s) => {
        resolve(s);
      });
    })
  }
}