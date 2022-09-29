export const patchCss = (content: string, id?: string) => {
    const style = Object.assign(
        document.createElement('style'),
        {
          className: `HYKORD_INJECTED_CSS${id ? `_${id}` : ''}`,
          textContent: content
        }
    );
    
    document.head.appendChild(style);
}

export const unpatchCss = (id: string) => {
  for (const css of Array.from(document.getElementsByClassName(`HYKORD_INJECTED_CSS${id ? `_${id}` : ''}`)))
    css.remove();
}