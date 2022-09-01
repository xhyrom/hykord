import { findAndPatch, after } from "@module/patcher";
import { findByDisplayName } from "@module/webpack";

const hykordSections = [];
const hykordPluginsSections = [];

export function registerSection(id, name, component) {
  const section = { section: id, label: name, element: component };
  hykordSections.push(section);

  return () => {
    const i = hykordSections.indexOf(section);
    if (i !== -1) hykordSections.splice(i, 1);
  };
}

export function registerPluginSection(id, name, component) {
  const section = { section: id, label: name, element: component };
  hykordPluginsSections.push(section);

  return () => {
    const i = hykordPluginsSections.indexOf(section);
    if (i !== -1) hykordPluginsSections.splice(i, 1);
  };
}

export const initUserSettings = () =>
  findAndPatch(
    () => findByDisplayName("SettingsView"),
    (SettingsView) =>
      after("getPredicateSections", SettingsView.prototype, (_, sects) => {
        const pos = sects.findIndex((e) => e.section === "changelog") - 1;

        // if we're not in user settings, die
        if (pos < 0) return;

        sects.splice(
          pos,
          0,
          { section: "DIVIDER" },
          { section: "HEADER", label: "Hykord" },
          ...hykordSections,
          { section: "DIVIDER" },
          { section: "HEADER", label: "Hykord Plugins" },
          ...hykordPluginsSections,
        );

        return sects;
      }),
);