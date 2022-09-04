import webpackJsonp from "./webpackJsonp";
import webpackChunk from "./webpackChunk";
import parcelRequire from "./parcelRequire";
//import amdLoader from "./amdLoader";

export default (key) => {
  const jsonp = webpackJsonp(key);
  if (jsonp?.[0]) return ["jsonp", ...jsonp];

  const chunk = webpackChunk(key);
  if (chunk?.[0]) return ["chunk", ...chunk];

  const parcel = parcelRequire(key);
  if (parcel) return ["parcel", parcel];

  /*const amd = amdLoader(key);
  if (amd) return ["amd", amd];*/

  throw new Error("No module fetching methods succeeded.");
};