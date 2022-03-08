// simple feature flags implementation to merge unfinished code in master
export const AvailableFeatureFlags = {
  TEMP: 'TEMP', // special feature flag that should wrap all WIP code
  HIDDEN_RENDERER: 'HIDDEN_RENDERER'
} as const;

export const NebulaFeatureFlag = {
  [AvailableFeatureFlags.TEMP]: process.env.NODE_ENV === 'development',
  // turn to true if you want to use the new hidden renderer to process tasks
  [AvailableFeatureFlags.HIDDEN_RENDERER]: false
};

export const getNebulaFeatureFlags = () => {
  if (process.env.NODE_ENV === 'development') {
    return [AvailableFeatureFlags.TEMP];
  }

  return [];
};
