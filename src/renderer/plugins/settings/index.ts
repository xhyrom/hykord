import { Plugin } from '@hykord/structures';
import { getByProps, getByPrototypeFields, getModule } from '@hykord/webpack';
import { after } from '@hykord/patcher';

export class Settings extends Plugin {
  unpatch: any;
  sections: { section: string; label: string; element: any }[] = [];

  name = 'Settings';
  author = 'Hykord';
  version = '0.0.0';
  toggleable = false;
  public async start(): Promise<void> {
      const React: typeof import('react') = (await this.getReact()).exports as any;
      const divider: any = (await this.getDivider()).exports;
      const userSettings: any = (await this.getSettings()).exports;
      
      this.registerSection('HYKORD_MAIN', 'Hykord', (await import('./Hykord')).default(React));

      this.unpatch = after('getPredicateSections', userSettings.prototype, (_, sects) => {
        const changelog = sects.find((c: any) => c.section.toLowerCase() === 'changelog');
        const debugInfo = sects[sects.findIndex((c: any) => c.section.toLowerCase() === 'custom') + 1];

        if (changelog) {
          sects.splice(
            sects.indexOf(changelog) - 1,
            0,
            { section: "DIVIDER" },
            { section: "HEADER", label: "Hykord" },
            ...this.sections,
//            { section: "DIVIDER" },
//            { section: "HEADER", label: "Hykord Plugins" },
          );
        }

        if (debugInfo) {
            debugInfo.element = (element => () => {
                const res = element();
    
                if (res.props.children && res.props.children.length === 4) {
                  // Add divider
                  res.props.children.push(
                    Object.assign({}, res.props.children[0], {
                      props: Object.assign({}, res.props.children[0].props, {
                        children: [ React.createElement(divider, {
                          className: 'hykord-form-divider'
                        })]
                      })
                    }),
                    // eslint-disable-next-line no-useless-escape
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
      })
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

  private async getReact() {
      let knownModule = getByProps('useState');
      while (!knownModule) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          knownModule = getByProps('useState');
      }

      return knownModule;
  }

  private async getDivider() {
      let knownModule = getModule(m => {
          if (typeof m !== 'function') return false;
          var s = m?.toString?.();
          if (!s) return false;
          return s.length < 200 && s.includes('divider')
      });

      while (!knownModule) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          knownModule = getModule(m => {
              if (typeof m !== 'function') return false;
              var s = m?.toString?.();
              if (!s) return false;
              return s.length < 200 && s.includes('divider')
          });
      }

      return knownModule;
  }

  private async getSettings() {
      let knownModule = getByPrototypeFields('getPredicateSections');
      while (!knownModule) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          knownModule = getByPrototypeFields('getPredicateSections');
      }

      return knownModule;
  }
}