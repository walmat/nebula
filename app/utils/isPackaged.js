export const isPackaged = process.mainModule
  ? process.mainModule.filename.indexOf('app.asar') !== -1
  : false;
