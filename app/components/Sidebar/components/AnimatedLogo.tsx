import React, { useState, useCallback } from 'react';
import { animated, useSpring } from 'react-spring';
import { Fade } from '@material-ui/core';
import classNames from 'classnames';
import { imgsrc } from '../../../utils/imgsrc';

const AnimatedLogo = ({
  classes,
  addedClass,
  collapsed,
  setTheme
}: {
  classes: any;
  addedClass: null | object;
  collapsed: boolean;
  setTheme: Function;
}) => {
  const [state, toggle] = useState(true);

  const clickHandler = useCallback(() => {
    setTheme();
    toggle(!state);
  }, [state]);

  const { x } = useSpring({
    from: { x: 0 },
    x: state ? 1 : 0,
    config: { duration: 1000 }
  });

  if (collapsed) {
    return null;
  }

  return (
    <animated.div
      style={{
        cursor: 'pointer',
        opacity: x.interpolate({ range: [0, 1], output: [0.8333, 1] }),
        transform: x
          .interpolate({
            range: [0, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 1],
            output: [1, 0.97, 0.9, 1.1, 0.9, 1.1, 1.03, 1]
          })
          .interpolate(x => `scale(${x})`)
      }}
    >
      <Fade in mountOnEnter unmountOnExit>
        <div
          onClick={clickHandler}
          className={classNames(classes.center, addedClass)}
        >
          <div className={classNames(classes.noAppDrag, addedClass)}>
            <img
              alt=""
              width="auto"
              height="auto"
              style={{ maxWidth: 115, borderRadius: '50%' }}
              src={imgsrc('logo.png', true)}
              className={classNames(classes.noAppDrag, addedClass)}
            />
          </div>
        </div>
      </Fade>
    </animated.div>
  );
};

export default AnimatedLogo;
