'use client';

import { createContext, useRef } from 'react';

export const SurveyIdsContext = createContext<
  React.MutableRefObject<readonly string[]>
>({ current: [] });

export function SurveyIdsContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
  const SurveyIdsRef = useRef<readonly string[]>([]);
  return (
    <SurveyIdsContext.Provider value={SurveyIdsRef}>
      {children}
    </SurveyIdsContext.Provider>
  );
}