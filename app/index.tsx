import { Redirect } from 'expo-router';
import React from 'react';
import { useAppStore } from '../src/state/store';

export default function Index() {
  const onboardingComplete = useAppStore((s) => s.onboardingComplete);
  return onboardingComplete ? (
    <Redirect href="/(tabs)/log" />
  ) : (
    <Redirect href="/onboarding" />
  );
}
