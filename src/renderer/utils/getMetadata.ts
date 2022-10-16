import { Theme } from '@hykord/structures/Theme';

export const getMetadata = (content: string): Theme => {
  return parseJsDoc(content);
};

// Parse jsdocs from multiline comment
const parseJsDoc = (comment: string) => {
  const jsDoc: any = {};
  const lines = comment.split(
    /[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/
  );

  for (const line of lines) {
    const match = line.match(/@(\w+)\s+(.*)/);

    if (match) {
      jsDoc[match[1]] = match[2];
    }
  }

  return jsDoc;
};
