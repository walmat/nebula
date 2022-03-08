import { useEffect, useRef } from 'react';

export function useTraceUpdate(props: any) {
  if (process.env.NODE_ENV === 'development') {
    const prev = useRef(props);
    useEffect(() => {
      const changedProps = Object.entries(props).reduce(
        (ps: any, [k, v]: [any, any]) => {
          if (prev.current[k] !== v) {
            // eslint-disable-next-line no-param-reassign
            ps[k] = [prev.current[k], v];
          }
          return ps;
        },
        {}
      );
      if (Object.keys(changedProps).length > 0) {
        console.info('Changed props:', changedProps);
      }
      prev.current = props;
    });
  }
}
