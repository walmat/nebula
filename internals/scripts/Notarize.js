const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  // eslint-disable-next-line no-return-await
  return await notarize({
    appBundleId: 'app.example.com',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: '',
    appleIdPassword: ''
  });
};
