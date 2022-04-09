import { Box } from '@mui/material';

let $ = require('jquery');
global.jQuery = require('jquery');
window.$ = $;
let bootstrap = require('bootstrap');
let bootbox = require('bootbox');

export const commonNodeModules = {
  Box,
  bootstrap,
  bootbox,
};