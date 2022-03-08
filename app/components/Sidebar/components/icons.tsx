import React from 'react';

import AppsIcon from '@material-ui/icons/Apps';
import EventNoteTwoToneIcon from '@material-ui/icons/EventNoteTwoTone';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ListAltTwoToneIcon from '@material-ui/icons/ListAltTwoTone';
import LibraryAdd from '@material-ui/icons/LibraryAdd';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import HttpsTwoToneIcon from '@material-ui/icons/HttpsTwoTone';
import AssessmentTwoToneIcon from '@material-ui/icons/AssessmentTwoTone';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';

export const getIcon = (name: string) => {
  return SIDEBAR_ICONS[name];
};

export const SIDEBAR_ICONS: any = {
  HomeIcon: <AppsIcon className="adjust-sizing" />,
  TimerIcon: <CheckCircleOutlineIcon className="adjust-sizing" />,
  TrackChangesIcon: <BookmarkBorderIcon className="adjust-sizing" />,
  ListAltIcon: <ListAltTwoToneIcon className="adjust-sizing" />,
  EventNoteIcon: <EventNoteTwoToneIcon className="adjust-sizing" />,
  InsertChart: <AssessmentTwoToneIcon className="adjust-sizing" />,
  LibraryAdd: <LibraryAdd className="adjust-sizing" />,
  Payment: <PersonOutlineIcon className="adjust-sizing" />,
  AttachMoneyIcon: <HttpsTwoToneIcon className="adjust-sizing" />
};
