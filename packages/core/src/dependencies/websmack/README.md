# Websmack

Web bundlers' hard work undone.

See CONTRIBUTING.md pls thx

All functions take a key to override attempting to find one itself.

This project continued and relocated from PolyStratum/webunpack -- yellowsink 2022-05-16

All site lists are non-exhaustive.

## Top level API documentation

### `autoraid(): ["find method", {...}, ?wpRequire]`

Just grabs the modules, trying every method until one works.

### `webpackJsonp(): [{...}, wpRequire]`

- Slack
- Twitter
  - Tweetdeck
- MS Teams (not the rest of Office 365!)
- Deezer
- Soundcloud

### `webpackChunk(): [{...}, wpRequire]`

- Discord
- Telegram (mostly)
- Tidal
- Spotify (web & app)

### `parcelRequire(): {...}`

Works on apps built with Parcel. No currently known sites/apps.

### `createApi([, modules, ?wpRequire]): {api}`

Creates an api of webpack searchers given found raw modules.
Designed to work in such a way that you can pass autoraid() directly to createApi.

API docs further down.

Yeah I know wrapping apis in a closure is cringe for bundle size and stuff, but like its just cleaner to use this way.

### `autoApi(): {api}`

`createApi(autoraid())`

### `batchFind([, modules]): (callback) => [...]`

Batch find a large number of modules.
Includes all functions from createApi except findByCode.
```js
batchFind(autoraid())(
	({ findByProps, findByDisplayName }) => {
      findByProps("dirtyDispatch");
      findByDisplayName("Markdown");
    }
);
```

## searcher API documentation

### `find(filter): module`

Finds the first module that matches the predicate.

### `findAll(filter): [...]`

Finds all modules that match the predicate

### `findByCode(code): module`

*!!! This function does not work in batch finds and in non-webpack situations !!!*

Finds a module by checking if a string / regex matches the bundled code.

Has an all variant.

### `findByDispNameDeep(name): module`

Finds by display name but also breaks through wrappers like memo (most of the time).

Has an all variant.

### `findByDisplayName(name, defaultExp = true): module`

Finds a module by its display name (if the app exports that prop on components).
Setting defaultExp to false will return the parent of the component for patching.

Has an all variant.

### `findByKeyword(...keys): module`

Finds a module by case insensitive substring matching. Useful for finding things you dont know the name of.

Has an all variant.

### `findByNestedProps(...props): module`

Finds a module by prop names in props of the module... weird to explain but useful for some apps (eg Kaiheila).
For example, `findByNestedProps("prop")` => `{ a: { prop: ... }, b: ... }`

Has an all variant.

### `findByProps(...props): module`

Finds a module by props that exist on it.
This will probably be your bread-and-butter finding function in apps that dont minify away export keys (eg Discord).

Has an all variant.