"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

interface AnalyticsContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
  isRefreshing: boolean;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const triggerRefresh = useCallback(() => {
    setIsRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  return (
    <AnalyticsContext.Provider
      value={{ refreshTrigger, triggerRefresh, isRefreshing }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error(
      "useAnalytics deve ser usado dentro de um AnalyticsProvider"
    );
  }
  return context;
}
