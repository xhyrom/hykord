import { findAndPatch, after } from "@hykord/patcher";
import { findByDisplayName, React } from "@hykord/webpack";
import { FormDivider } from "@hykord/components";

const hykordSections = [];
let hykordPluginsSections = [];

export function registerSection(id, name, component) {
  const section = { section: id, label: name, element: component };
  hykordSections.push(section);

  return () => {
    const i = hykordSections.indexOf(section);
    if (i !== -1) hykordSections.splice(i, 1);
  };
}

export function registerPluginSection(id: string, name: string, component) {
  const section = { section: id, label: name, element: component };
  hykordPluginsSections.push(section);

  return () => {
    const i = hykordPluginsSections.indexOf(section);
    if (i !== -1) hykordPluginsSections.splice(i, 1);
  };
}

export function unregisterPluginSection(id: string) {
  hykordPluginsSections = hykordPluginsSections.filter(s => s.section !== id);
}

export const initUserSettings = () =>
  findAndPatch(
    () => findByDisplayName("SettingsView"),
    (SettingsView) =>
      after("getPredicateSections", SettingsView.prototype, (_, sects) => {
        const changelog = sects.find((e) => e.section === "changelog");

        if (changelog) {
          sects.splice(
            sects.indexOf(changelog) - 1,
            0,
            { section: "DIVIDER" },
            { section: "HEADER", label: "Hykord" },
            ...hykordSections,
            { section: "DIVIDER" },
            { section: "HEADER", label: "Hykord Plugins" },
            ...hykordPluginsSections,
          );
        }

        const debugInfo = sects[sects.findIndex(c => c.section === 'CUSTOM') + 1];
        if (debugInfo) {
          debugInfo.element = (element => () => {
            const res = element();

            if (res.props.children && res.props.children.length === 4) {
              // Add divider
              res.props.children.push(
                Object.assign({}, res.props.children[0], {
                  props: Object.assign({}, res.props.children[0].props, {
                    children: [ React.createElement(FormDivider, {
                      className: 'hykord-form-divider'
                    })]
                  })
                }),
                // eslint-disable-next-line no-useless-escape
                ...window.navigator.userAgent.match(/[a-zA-Z\/]+\/(\d+\.)?(\d+\.)?(\*|\d+)+/gm).map((match) => {
                  return Object.assign({}, res.props.children[0], {
                    props: Object.assign({}, res.props.children[0].props, {
                      children: [ match.split('/')[0], ' ', React.createElement('span', {
                        className: res.props.children[0].props.children[4].props.className,
                        children: [ match.split('/')[1] ]
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
      }),
);