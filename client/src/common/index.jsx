import { Box } from '@mui/material';
import useGetRoute from './use_Get_Route';

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

export const commonModules = {
  useGetRoute,
};