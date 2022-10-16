import * as Legacy from './legacy';

export default class BdApi {
    
}

// @ts-expect-error aaa
Object.assign(BdApi, Legacy);

Object.freeze(BdApi);
Object.freeze(BdApi.prototype);