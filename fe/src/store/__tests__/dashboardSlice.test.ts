import { describe, it, expect, vi } from 'vitest';
import dashboardReducer, { fetchDashboardData } from '../dashboardSlice';
import { mockDashboardData } from '../../test/utils';

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('dashboardSlice', () => {
  const initialState = {
    data: null,
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(dashboardReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchDashboardData', () => {
    it('should handle pending state', () => {
      const action = { type: fetchDashboardData.pending.type };
      const state = dashboardReducer(initialState, action);
      
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle fulfilled state', () => {
      const action = {
        type: fetchDashboardData.fulfilled.type,
        payload: mockDashboardData,
      };
      const state = dashboardReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.data).toEqual(mockDashboardData);
      expect(state.error).toBe(null);
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Failed to fetch data';
      const action = {
        type: fetchDashboardData.rejected.type,
        error: { message: errorMessage },
      };
      const state = dashboardReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.data).toBe(null);
    });
  });
}); 