"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineService = void 0;
const determineService = (url) => url.match(/open\.spotify/)
    ? "spotify"
    : url.match(/deezer\.com/)
        ? "deezer"
        : null;
exports.determineService = determineService;
