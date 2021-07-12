"use strict";

const RandExp = require("randexp");

const possible =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789×";

const RAN_GEN_TOP = (r) => {
  if (!r) return "";
  let t;
  // eslint-disable-next-line no-sequences
  if ("Uint8Array" in this && "crypto" in this && r <= 65536)
    (t = new Uint8Array(r)), this.crypto.getRandomValues(t);
  else {
    t = new Array(r);
    for (let _ = 0; _ < r; _++) t[_] = Math.floor(62 * Math.random());
  }
  let _ = "";
  for (let e = 0; e < r; e++) _ += possible.charAt(t[e] % 62);
  return _;
};

const RAN_GEN_1 = (r) => {
  let t = "";
  for (let _ = 0; _ < r; _++)
    t += possible.charAt(Math.floor(Math.random() * possible.length));
  return t;
};

const RAN_GEN_2 = (r, t = "") => {
  for (; r--; )
    t += String.fromCharCode(
      ((t = (62 * Math.random()) | 0), (t += t > 9 ? (t < 36 ? 55 : 61) : 48))
    );
  return t;
};

const RAN_GEN_Shuff = (r) => [...r].sort((r) => Math.random() - 0.5).join("");

const RAN_GEN_3 = (r) => {
  let t = "";
  for (let _ = 0; _ < r; _++) {
    let r = Math.floor(62 * Math.random());
    let _ = (r += r > 9 ? (r < 36 ? 55 : 61) : 48);
    t += String.fromCharCode(_);
  }
  return t;
};

const RAN_GEN_Direct = new Array(24).join().replace(/(.|$)/g, function () {
  return ((36 * Math.random()) | 0)
    .toString(36)
    [Math.random() < 0.5 ? "toString" : "toUpperCase"]();
});

const RAN_GEN_Direct_C = new Array(16).join().replace(/(.|$)/g, function () {
  return ((36 * Math.random()) | 0)
    .toString(36)
    [Math.random() < 0.5 ? "toString" : "toUpperCase"]();
});

const RAN_GEN_4 = [...Array(24)]
  .map((r) => possible[~~(Math.random() * possible.length)])
  .join("");

const RAN_GEN_4_C = [...Array(16)]
  .map((r) => possible[~~(Math.random() * possible.length)])
  .join("");

const RAN_REGEX = new RandExp(/^[0-9,a-z,A-Z]{24}$/).gen();

const RAN_REGEX_C = new RandExp(/^[0-9,a-z,A-Z]{24}$/).gen();

module.exports = {
  RAN_GEN_TOP,
  RAN_GEN_1,
  RAN_GEN_2,
  RAN_GEN_3,
  RAN_GEN_4,
  RAN_GEN_Direct,
  RAN_GEN_Shuff,
  RAN_REGEX,
  RAN_GEN_4_C,
  RAN_REGEX_C,
  RAN_GEN_Direct_C,
};
