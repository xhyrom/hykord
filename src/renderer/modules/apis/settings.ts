// Sections are injected in settingsApi plugin
export let sections: { priority: number; section: string; label: string; element: any }[] = [];

// For plugin settings use `settings` property in Plugin
export const registerSection = (id: string, name: string, component: any, priority = 99) => {
  const section = { priority: priority, section: id, label: name, element: component };
  sections.push(section);

  sections.sort((a, b) => a.priority - b.priority);

  return () => {
    const i = sections.indexOf(section);
    if (i !== -1) sections.splice(i, 1);
  };
};

export const unregisterSection = (id: string) => {
  sections = sections.filter((s) => s.section !== id);
};