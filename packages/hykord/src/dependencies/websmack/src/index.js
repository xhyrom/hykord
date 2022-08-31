export * from "./raid";
// javascript:tm:
//export createApi from "./api";
export { default as createApi, batchFind as createBatchFind } from "./api";


import { autoraid } from "./raid";
import createApi from "./api"
export const autoApi = () => createApi(autoraid())