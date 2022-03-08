import React from 'react';
import { useSelector } from 'react-redux';
import NoChildrenComponent from '../../../NoChildrenComponent';
import { makeHarvesters } from '../../selectors';
import CardComponent from '../card';

const HarvestersGrid = () => {
  const captchas = useSelector(makeHarvesters);

  if (!captchas.length) {
    return <NoChildrenComponent label="No Harvesters" variant="h6" />;
  }
  return captchas.map((captcha: any) => (
    <CardComponent key={captcha.id} captcha={captcha} />
  ));
};

export default HarvestersGrid;
