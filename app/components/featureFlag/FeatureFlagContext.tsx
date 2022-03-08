import React, { useContext, useCallback } from 'react';

export const FeatureFlagContext = React.createContext<string[]>([]);

export const useFeatureFlag = () => {
  const features = useContext<string[]>(FeatureFlagContext);

  const hasFeature = useCallback(
    (feature: string) => {
      return features.includes(feature);
    },
    [features]
  );

  return {
    hasFeature
  };
};

type Props = {
  feature: string;
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
};
export const FeatureFlag = ({
  feature,
  fallbackComponent = null,
  children
}: Props) => {
  const { hasFeature } = useFeatureFlag();

  if (!hasFeature(feature)) {
    return fallbackComponent;
  }

  return children;
};
