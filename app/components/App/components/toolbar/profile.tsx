import React from 'react';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/styles';

import {
  Typography,
  Badge,
  ListItem,
  ListItemText,
  Avatar,
  Tooltip
} from '@material-ui/core';

import { makeUser } from '../../selectors';
import { styles } from '../../styles/ToolbarAreaPane';

const useStyles = makeStyles(styles);

const ToolbarAreaPane = ({ handleClick }: { handleClick: any }) => {
  const styles = useStyles();
  const user = useSelector(makeUser);

  let badgeStyle = styles.badge;
  let displayName = '';
  let subtext = '';
  let avatarUrl = '';
  let badgeTitle = '';
  if (user) {
    const { id, avatar, name, username, type } = user;
    badgeTitle = type;
    displayName = name;
    subtext = username;

    if (avatar) {
      if (avatar.startsWith('a_')) {
        avatarUrl = `https://cdn.discordapp.com/avatars/${id}/${avatar}.gif`;
      } else {
        avatarUrl = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
      }
    }
  }

  if (badgeTitle === 'Staff') {
    badgeStyle = styles.badgeStaff;
  }

  if (badgeTitle === 'Renewal') {
    badgeStyle = styles.badgeMember;
  }

  if (badgeTitle === 'Lifetime' || badgeTitle === 'F&F') {
    badgeStyle = styles.badgeLifetime;
  }

  return (
    <ListItem>
      <ListItemText
        className={classnames(styles.inline, styles.condenseRight)}
        primary={
          <Typography
            variant="caption"
            className={classnames(styles.inline, styles.bold)}
          >
            {displayName}
          </Typography>
        }
        secondary={
          <Typography
            variant="caption"
            className={classnames(styles.inline, styles.subtext)}
          >
            {subtext}
          </Typography>
        }
        primaryTypographyProps={{
          style: {
            lineHeight: 1
          }
        }}
        secondaryTypographyProps={{
          style: {
            lineHeight: 1
          }
        }}
      />

      <Badge
        variant="dot"
        classes={{
          badge: badgeStyle
        }}
        className={styles.noAppDrag}
        badgeContent=" "
      >
        <Tooltip title={badgeTitle}>
          <Avatar
            src={avatarUrl}
            onClick={handleClick}
            classes={{
              img: styles.noAppDrag
            }}
            className={classnames(styles.noAppDrag, styles.avatar)}
            style={{ backgroundColor: 'transparent' }}
          />
        </Tooltip>
      </Badge>
    </ListItem>
  );
};

export default ToolbarAreaPane;
