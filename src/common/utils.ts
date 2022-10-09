export const deepen = (map: Map<any, any>) => {
  const object = Object.fromEntries(map);
  const result = {};

  for (const objectPath in object) {
    const parts = objectPath.split('.');

    let target: any = result;
    while (parts.length > 1) {
      const part: any = parts.shift() as any;
      target = target[part] = target[part] || {};
    }

    target[parts[0]] = object[objectPath] instanceof Set ? [...object[objectPath]] : object[objectPath];
  }

  return result;
};

export const convertToMap = (
  object: any,
  key?: string,
  map?: Map<any, any>,
) => {
  map = map || new Map();

  for (const [name, v] of Object.entries(object)) {
    const value = v as string | boolean;

    if (typeof value !== 'object' || Array.isArray(value))
      map.set(key + name, Array.isArray(value) ? new Set(value) : value);
    else convertToMap(value, `${key ? `${key}` : ''}${name}.`, map);
  }

  return map;
};
