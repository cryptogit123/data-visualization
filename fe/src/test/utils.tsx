import React from 'react';
import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import dashboardReducer from '../store/dashboardSlice';
import type { RootState } from '../store';

function render(
  ui: React.ReactElement,
  {
    preloadedState,
    store = configureStore({
      reducer: {
        dashboard: dashboardReducer,
      },
      preloadedState: preloadedState as RootState,
    }),
    ...renderOptions
  }: {
    preloadedState?: Partial<RootState>;
    store?: ReturnType<typeof configureStore>;
  } = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock data for testing
export const mockDashboardData = {
  customerTypes: [
    { Cust_Type: 'Enterprise', count: 10, acv: 1000000, closed_fiscal_quarter: '2024Q1' },
    { Cust_Type: 'SMB', count: 20, acv: 500000, closed_fiscal_quarter: '2024Q1' },
  ],
  accountIndustries: [
    { Acct_Industry: 'Technology', count: 15, acv: 750000, closed_fiscal_quarter: '2024Q1' },
    { Acct_Industry: 'Healthcare', count: 25, acv: 1250000, closed_fiscal_quarter: '2024Q1' },
  ],
  teams: [
    { Team: 'Sales', count: 12, acv: 600000, closed_fiscal_quarter: '2024Q1' },
    { Team: 'Marketing', count: 18, acv: 900000, closed_fiscal_quarter: '2024Q1' },
  ],
  acvRanges: [
    { ACV_Range: '0-50K', count: 30, acv: 1500000, closed_fiscal_quarter: '2024Q1' },
    { ACV_Range: '50K-100K', count: 20, acv: 1000000, closed_fiscal_quarter: '2024Q1' },
  ],
};

export { render, screen, fireEvent, waitFor }; 