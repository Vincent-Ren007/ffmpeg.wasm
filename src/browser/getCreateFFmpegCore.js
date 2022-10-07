/* eslint-disable no-undef */
const { log } = require("../utils/log");
const { CREATE_FFMPEG_CORE_IS_NOT_DEFINED } = require("../utils/errors");

/*
 * Fetch data from remote URL and convert to blob URL
 * to avoid CORS issue
 */
const toBlobURL = async (url, mimeType) => {
  log("info", `fetch ${url}`);
  const buf = await (await fetch(url)).arrayBuffer();
  log("info", `${url} file size = ${buf.byteLength} bytes`);
  const blob = new Blob([buf], { type: mimeType });
  const blobURL = URL.createObjectURL(blob);
  log("info", `${url} blob URL = ${blobURL}`);
  return blobURL;
};

export const getCreateFFmpegCore = async ({
  corePath: _corePath,
  workerPath: _workerPath,
  wasmPath: _wasmPath,
}) => {
  if (typeof createFFmpegCore === "undefined") {
    return new Promise((resolve) => {
      globalThis.importScripts(_corePath);
      if (typeof createFFmpegCore === "undefined") {
        throw Error(CREATE_FFMPEG_CORE_IS_NOT_DEFINED(coreRemotePath));
      }
      log("info", "ffmpeg-core.js script loaded");
      resolve({
        createFFmpegCore,
        _corePath,
        wasmPath,
        workerPath,
      });
    });
  }
  log("info", "ffmpeg-core.js script is loaded already");
  return Promise.resolve({
    createFFmpegCore,
    corePath,
    wasmPath,
    workerPath,
  });
};
