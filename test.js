const deepen = (map) => {
    const object = Object.fromEntries(map);
    const result = {};
  
    for (const objectPath in object) {
      const parts = objectPath.split('.');
  
      let target = result;
      while (parts.length > 1) {
        const part = parts.shift();
        target = target[part] = target[part] || {};
      }
  
      target[parts[0]] = object[objectPath] instanceof Set ? [...object[objectPath]] : object[objectPath];
    }
  
    return result;
};

const map = new Map();

const set = new Set();
set.add('valjú');
map.set('a.b.c', set);

console.log(JSON.stringify(deepen(map)));