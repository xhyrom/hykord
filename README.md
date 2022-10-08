# Hykord
> Full rewrite of old hykord

## Features
- Simple and easy to use discord client
- Supports themes
  - Also BD themes
- Supports plugins
  - BD plugins are in development
- All discord versions (stable, canary, ptb, development)

## Installation
> **Warning:** This is a rewrite of old hykord, so you need to uninstall old hykord first  
> Automatic installer is WIP

1. You must have [node.js](https://nodejs.org/en/) installed (also bun for pkg manager, optional)
2. Clone this repo into any folder
3. Install dependencies `npm install`
4. Run patcher `npm run patch`
   1. You can also add `app/index.js` and `app/package.json` to discord app resources/ folder
 ```js
 // index.js
 require("PATH\\dist\\main");
 require("../app.asar");

 // package.json
 {"name": "discord", "main": "index.js"}
 ```
5. Build project `npm run build`
