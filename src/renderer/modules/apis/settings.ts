// Sections are injected in Settings plugin
export const sections: { section: string; label: string; element: any }[] = [];

export const registerSection = (id: string, name: string, component: any) => {
    const section = { section: id, label: name, element: component };
    sections.push(section);
  
    return () => {
      const i = sections.indexOf(section);
      if (i !== -1) sections.splice(i, 1);
    };
}