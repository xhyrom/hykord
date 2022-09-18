import { registerPluginSection, unregisterPluginSection } from '@api/ui/userSettingsHykord';
import electron from 'electron';

export * as modals from './modals';
export * as loaders from './loaders';
export * as notifications from './notifications';

export const registerSection = registerPluginSection;
export const unregisterSection = unregisterPluginSection;

export const linkify = (text: string) => {
    return text.replace(/(((https?:\/\/)|(www\.))[^\s]+)/g, (url) => '<a href="' + url + '">' + url + '</a>');
}

export const nameToId = (text: string): string => {
    return text.replaceAll(' ', '-').toLowerCase();
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const tryRequireOrX = (path: string, defaultValue = null) => {
  try {
    return require(path);
  } catch {
    return defaultValue;
  }
}

export const waitFor = async(querySelector) => {
    let elem;
  
    // @ts-expect-error Use document from top context
    while (!(elem = electron.webFrame.top.context.document.querySelector(querySelector))) {
      await sleep(1);
    }
  
    return elem;
};

// @ts-expect-error works
const TrueElement = global.NEW_BACKEND || !process.contextIsolated
  ? Element
  // @ts-expect-error works
  : electron.webFrame.top.context.Element;

export const getReactInstance = (node) => node.__reactFiber$;

export const getOwnerInstance = (node) => {
  for (let curr = getReactInstance(node); curr; curr = curr.return) {
    const owner = curr.stateNode;
    if (owner && !(owner instanceof TrueElement)) {
      return owner;
    }
  }

  return null;
};

export const forceUpdateElement = (query, all = false) => {
  // @ts-expect-error Use document from top context
  const elements = all ? [ ...electron.webFrame.top.context.document.querySelectorAll(query) ] : [ electron.webFrame.top.context.document.querySelector(query) ];
  elements.filter(Boolean).forEach(element => {
    getOwnerInstance(element)?.forceUpdate();
  });
};

/**
 * @source https://github.com/powercord-org/powercord/blob/v2/src/fake_node_modules/powercord/util/findInTree.js
 */
export const findInTree = (tree, filter, { walkable = null, ignore = [] } = {}) => {
  if (!tree || typeof tree !== 'object') {
    return null;
  }

  if (typeof filter === 'string') {
    // eslint-disable-next-line no-prototype-builtins
    if (tree.hasOwnProperty(filter)) {
      return tree[filter];
    }

    return;
  } else if (filter(tree)) {
    return tree;
  }

  let returnValue = null;

  if (Array.isArray(tree)) {
    for (const value of tree) {
      returnValue = findInTree(value, filter, {
        walkable,
        ignore
      });

      if (returnValue) {
        return returnValue;
      }
    }
  } else {
    const walkables = !walkable ? Object.keys(tree) : walkable;

    for (const key of walkables) {
      // eslint-disable-next-line no-prototype-builtins
      if (!tree.hasOwnProperty(key) || ignore.includes(key)) {
        continue;
      }

      returnValue = findInTree(tree[key], filter, {
        walkable,
        ignore
      });

      if (returnValue) {
        return returnValue;
      }
    }
  }

  return returnValue;
};

export const findInReactTree = (tree, filter) => {
  return findInTree(tree, filter, {
    walkable: [ 'props', 'children', 'child', 'sibling' ]
  });
};