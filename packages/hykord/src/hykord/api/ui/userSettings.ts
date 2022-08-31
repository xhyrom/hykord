import { findAndPatch, after } from "@module/patcher";
import { findByDisplayName } from "@module/webpack";

const sections = [];

export function registerSection(id, name, component) {
  const section = { section: id, label: name, element: component };
  sections.push(section);

  return () => {
    const i = sections.indexOf(section);
    if (i !== -1) sections.splice(i, 1);
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
          ...sections,
        );

        return sects;
      }),
);