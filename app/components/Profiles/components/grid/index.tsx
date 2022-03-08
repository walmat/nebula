import React from 'react';
import { useSelector } from 'react-redux';
import NoChildrenComponent from '../../../NoChildrenComponent';
import { makeProfiles } from '../../selectors';
import CardComponent from '../card';

const ProfileGrid = () => {
  const profiles = useSelector(makeProfiles);

  if (!profiles.length) {
    return <NoChildrenComponent label="No Profiles" variant="h6" />;
  }
  return profiles.map((profile: any) => (
    <CardComponent key={profile.id} profile={profile} />
  ));
};

export default ProfileGrid;
