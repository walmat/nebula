import React, { Fragment, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/styles';

import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

import { Link, useLocation } from 'react-router-dom';
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@material-ui/core';
import { styles } from './styles';
import { SIDEBAR } from './components/menuItems';
import AnimatedLogo from './components/AnimatedLogo';

import { RootState } from '../../store/reducers';
import { setTheme } from '../App/actions';
import { changeTheme } from '../Captchas/actions';

import { getIcon } from './components/icons';

const useStyles = makeStyles(styles);

const themeToNext = (theme: number) => (theme === 0 ? 1 : 0);

const Sidebar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const theme = useSelector((state: RootState) => state.Theme);
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleSetCollapsed = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed]);

  const handleSetTheme = useCallback(() => {
    const nextTheme = themeToNext(theme) || 0;
    dispatch(setTheme(nextTheme));
    dispatch(changeTheme(nextTheme));
  }, [theme]);

  // if we have a menu items with a submenu, render that
  const isActivePath = useCallback(
    (route: any) =>
      pathname === route || (pathname === '/' && route === '/analytics'),
    [pathname]
  );

  const renderSubMenu = (menuItem: any) => {
    const { subMenu } = menuItem;
    return (
      <Fragment key={menuItem.name}>
        <List key={menuItem.name} component="div" disablePadding>
          <ListItem key={menuItem.name} className={classes.navigationHeader}>
            <ListItemText
              primary={menuItem.name}
              classes={{
                primary: classes.navText
              }}
            />
            <div className={classes.afterRight} />
          </ListItem>
          <List key={`${menuItem.name}__list`} component="div" disablePadding>
            {subMenu.map((item: any, i: number) => {
              const className = [classes.navBtns];
              const isActive = isActivePath(item.path);

              if (item.disabled) {
                return (
                  <Fragment key={item.name}>
                    <ListItem
                      key={`${item.name}--item`}
                      className={classNames(
                        className,
                        isActive
                          ? [classes.activeNavBg, classes.activeNavText]
                          : null,
                        classes.nested,
                        classes.nestedDisabled
                      )}
                    >
                      <ListItemIcon
                        className={classNames(
                          className,
                          isActive ? classes.activeNavText : ''
                        )}
                      >
                        {getIcon(item.img)}
                      </ListItemIcon>
                      <ListItemText
                        classes={{
                          primary: isActive
                            ? classes.activeNavText
                            : classes.navText
                        }}
                        primary={item.name}
                        className={classNames(
                          className,
                          isActive ? classes.activeNavText : classes.navText
                        )}
                      />
                    </ListItem>
                  </Fragment>
                );
              }

              if (i === subMenu.length - 1) {
                return (
                  <Fragment key={item.name}>
                    {isActive ? (
                      <div key={item.name}>
                        <ListItem
                          key={`${item.name}--item`}
                          className={classNames(
                            className,
                            isActive
                              ? [classes.activeNavBg, classes.activeNavText]
                              : '',
                            classes.nested
                          )}
                        >
                          <ListItemIcon
                            key={`${item.name}--icon`}
                            className={classNames(
                              className,
                              isActive ? classes.activeNavText : ''
                            )}
                          >
                            {getIcon(item.img)}
                          </ListItemIcon>
                          <ListItemText
                            classes={{
                              primary: isActive
                                ? classes.activeNavText
                                : classes.navText
                            }}
                            key={`${item.name}--text`}
                            primary={item.name}
                            className={classNames(
                              className,
                              isActive ? classes.activeNavText : classes.navText
                            )}
                          />
                        </ListItem>
                      </div>
                    ) : (
                      <Link key={item.name} to={item.path}>
                        <ListItem
                          key={`${item.name}--item`}
                          className={classNames(
                            className,
                            isActive
                              ? [classes.activeNavBg, classes.activeNavText]
                              : '',
                            classes.nested
                          )}
                        >
                          <ListItemIcon
                            key={`${item.name}--icon`}
                            className={classNames(
                              className,
                              isActive ? classes.activeNavText : ''
                            )}
                          >
                            {getIcon(item.img)}
                          </ListItemIcon>
                          <ListItemText
                            classes={{
                              primary: isActive
                                ? classes.activeNavText
                                : classes.navText
                            }}
                            key={`${item.name}--text`}
                            primary={item.name}
                            className={classNames(
                              className,
                              isActive ? classes.activeNavText : classes.navText
                            )}
                          />
                        </ListItem>
                      </Link>
                    )}
                    <ListItem className={classes.spacer} />
                  </Fragment>
                );
              }
              return isActive ? (
                <div key={item.name}>
                  <ListItem
                    key={`${item.name}--item`}
                    className={classNames(
                      className,
                      isActive
                        ? [classes.activeNavBg, classes.activeNavText]
                        : '',
                      classes.nested
                    )}
                  >
                    <ListItemIcon
                      key={`${item.name}--icon`}
                      className={classNames(
                        className,
                        isActive ? classes.activeNavText : ''
                      )}
                    >
                      {getIcon(item.img)}
                    </ListItemIcon>
                    <ListItemText
                      classes={{
                        primary: isActive
                          ? classes.activeNavText
                          : classes.navText
                      }}
                      key={`${item.name}--text`}
                      primary={item.name}
                      className={classNames(
                        className,
                        isActive ? classes.activeNavText : classes.navText
                      )}
                    />
                  </ListItem>
                </div>
              ) : (
                <Link key={item.name} to={item.path}>
                  <ListItem
                    key={`${item.name}--item`}
                    className={classNames(
                      className,
                      isActive
                        ? [classes.activeNavBg, classes.activeNavText]
                        : '',
                      classes.nested
                    )}
                  >
                    <ListItemIcon
                      key={`${item.name}--icon`}
                      className={classNames(
                        className,
                        isActive ? classes.activeNavText : ''
                      )}
                    >
                      {getIcon(item.img)}
                    </ListItemIcon>
                    <ListItemText
                      classes={{
                        primary: isActive
                          ? classes.activeNavText
                          : classes.navText
                      }}
                      key={`${item.name}--text`}
                      primary={item.name}
                      className={classNames(
                        className,
                        isActive ? classes.activeNavText : classes.navText
                      )}
                    />
                  </ListItem>
                </Link>
              );
            })}
          </List>
        </List>
      </Fragment>
    );
  };

  const _renderMenuItems = (menuItem: any) => {
    const className = [classes.noAppDrag];

    const { subMenu, path, name, img } = menuItem;

    if (subMenu) {
      return renderSubMenu(menuItem);
    }

    const isActive = isActivePath(path);

    return (
      <Fragment key={name}>
        {isActive ? (
          <div key={name} className={classNames(className, classes.noAppDrag)}>
            <ListItem
              key={`${name}--item`}
              className={classNames(
                className,
                classes.noAppDrag,
                classes.mainNavigation,
                isActive ? classes.activeNavBg : ''
              )}
            >
              <ListItemIcon
                key={`${name}--icon`}
                className={classNames(
                  className,
                  classes.defaultIcon,
                  isActive ? classes.activeNavText : ''
                )}
              >
                {getIcon(img)}
              </ListItemIcon>
              <ListItemText
                key={`${name}--text`}
                classes={{
                  primary: isActive
                    ? classNames(classes.activeNavText, classes.noPaddingLeft)
                    : classNames(classes.noPadding, classes.navText)
                }}
                primary={name}
                className={
                  isActive
                    ? classNames(classes.activeNavText, classes.noPaddingLeft)
                    : classNames(classes.noPadding, classes.navText)
                }
              />
            </ListItem>
          </div>
        ) : (
          <Link
            key={name}
            to={path}
            className={classNames(className, classes.noAppDrag)}
          >
            <ListItem
              key={`${name}--item`}
              className={classNames(
                className,
                classes.noAppDrag,
                classes.mainNavigation,
                classes.defaultIcon,
                isActive ? classes.activeNavBg : ''
              )}
            >
              <ListItemIcon
                key={`${name}--icon`}
                className={classNames(
                  className,
                  classes.defaultIcon,
                  isActive ? classes.activeNavText : ''
                )}
              >
                {getIcon(img)}
              </ListItemIcon>
              <ListItemText
                key={`${name}--text`}
                classes={{
                  primary: isActive
                    ? classNames(classes.activeNavText, classes.noPaddingLeft)
                    : classNames(classes.noPadding, classes.navText)
                }}
                primary={name}
                className={
                  isActive
                    ? classNames(classes.activeNavText, classes.noPaddingLeft)
                    : classNames(classes.noPadding, classes.navText)
                }
              />
            </ListItem>
          </Link>
        )}
      </Fragment>
    );
  };

  const _renderSidebarItems = () => {
    if (collapsed) {
      return (
        <Grid item className={classes.colCenter} onClick={handleSetCollapsed}>
          <KeyboardArrowRightIcon
            className={classNames(
              classes.colCenter,
              classes.collapsedBtn,
              classes.defaultIcon
            )}
          />
        </Grid>
      );
    }

    return (
      <List className={classes.col}>
        <Typography className={classes.navHeader}>Navigation</Typography>
        {Object.values(SIDEBAR).map(src => _renderMenuItems(src))}
        <ListItem
          onClick={handleSetCollapsed}
          key="collapse-navigation-btn"
          className={classNames(classes.altNavigation, classes.shrinkText)}
        >
          <ListItemIcon
            key="collapse-navigation-icon"
            className={classes.noMarginRight}
          >
            <KeyboardArrowLeftIcon
              className={(classes.defaultIcon, classes.adjustSizing)}
            />
          </ListItemIcon>
          <ListItemText
            primary="Collapse Navigation"
            key="collapse-navigation-text"
            classes={{
              primary: classNames(classes.shrinkText, classes.collapse)
            }}
            className={classNames(
              classes.shrinkText,
              classes.collapse,
              classes.marginBottom
            )}
          />
        </ListItem>
      </List>
    );
  };

  const addedClass = collapsed ? classes.addedStyle : {};
  const rootClass = collapsed ? classes.rootCollapsed : classes.root;
  const colClass = collapsed ? classes.colCenter : classes.col;

  if (/privacy|terms|bugs|progressbar/i.test(pathname)) {
    return null;
  }

  return (
    <div className={rootClass}>
      <AnimatedLogo
        collapsed={collapsed}
        addedClass={addedClass}
        classes={classes}
        setTheme={handleSetTheme}
        key="logo-animated"
      />
      <div className={colClass}>{_renderSidebarItems()}</div>
    </div>
  );
};

export default Sidebar;
