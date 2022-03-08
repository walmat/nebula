import React from 'react';

import EcoIcon from '@material-ui/icons/Eco';
import SafeModeIcon from '@material-ui/icons/VerifiedUser';
import FastModeIcon from '@material-ui/icons/FlashOn';
import BrowserModeIcon from '@material-ui/icons/Language';
import RestockModeIcon from '@material-ui/icons/Autorenew';
import DirectionsIcon from '@material-ui/icons/Directions';
import BookmarkIcon from '@material-ui/icons/Bookmark';

import { imgsrc } from '../../../../../utils/imgsrc';

export const MODE_ICONS: any = {
  SAFE: (classes: any) => <SafeModeIcon className={classes} />,
  FAST: (classes: any) => <FastModeIcon className={classes} />,
  HYBRID: (classes: any) => <BrowserModeIcon className={classes} />,
  REQUEST: (classes: any) => <FastModeIcon className={classes} />,
  SPLASH: (classes: any) => <BrowserModeIcon className={classes} />,
  BROWSER: (classes: any) => <BrowserModeIcon className={classes} />,
  RESTOCK: (classes: any) => <RestockModeIcon className={classes} />,
  PFUTILE: (classes: any) => <BookmarkIcon className={classes} />,
  PRELOAD: (classes: any) => <DirectionsIcon className={classes} />,
  NORMAL: (classes: any) => <EcoIcon className={classes} />,
  RELEASE: (classes: any) => <FastModeIcon className={classes} />,
  MOBILE: (classes: any) => <FastModeIcon className={classes} />,
  PAYPAL: (classes: any, theme: number) => {
    if (theme === 1) {
      return (
        <img className={classes} alt="" src={imgsrc('paypal-light.png')} />
      );
    }
    return <img className={classes} alt="" src={imgsrc('paypal-dark.png')} />;
  }
};
