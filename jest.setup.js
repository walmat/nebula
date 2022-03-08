/* eslint-disable no-undef */

import '@testing-library/jest-dom/extend-expect';
import React from 'react';

jest.mock('dns');
jest.mock('electron');
jest.mock('electron-ga');
jest.mock('request-promise');

// TODO - avoid mocking this
jest.mock('react-apexcharts', () => {
  return jest.fn(() => <span>ReactApexChart</span>);
});

require('jest-fetch-mock').enableMocks();

window.scrollTo = () => {};

window.matchMedia = jest.fn().mockImplementation(query => {
  return {
    matches: true,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  };
});

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js');

  return class {
    static placements = PopperJS.placements;

    constructor() {
      return {
        destroy: jest.fn(),
        scheduleUpdate: jest.fn(),
        update: jest.fn()
      };
    }
  };
});

global.window.document.createRange = function createRange() {
  return {
    setEnd: () => {},
    setStart: () => {},
    getBoundingClientRect: () => {
      return { right: 0 };
    },
    getClientRects: () => [],
    commonAncestorContainer: document.createElement('div')
  };
};
