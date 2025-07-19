import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { CustomerTypeData, AccountIndustryData, TeamData, ACVRangeData } from '../types';

interface DashboardData {
  customerTypes: CustomerTypeData[];
  accountIndustries: AccountIndustryData[];
  teams: TeamData[];
  acvRanges: ACVRangeData[];
}

// Simulated API call with delay
const fetchData = async (): Promise<DashboardData> => {
  // Add artificial delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    customerTypes: [
      { Cust_Type: "New Customer", count: 10, closed_fiscal_quarter: "2024-Q1" },
      { Cust_Type: "Existing Customer", count: 19, closed_fiscal_quarter: "2024-Q1" },
      { Cust_Type: "New Customer", count: 8, closed_fiscal_quarter: "2023-Q4" },
      { Cust_Type: "Existing Customer", count: 15, closed_fiscal_quarter: "2023-Q4" },
      { Cust_Type: "New Customer", count: 12, closed_fiscal_quarter: "2023-Q3" },
      { Cust_Type: "Existing Customer", count: 22, closed_fiscal_quarter: "2023-Q3" },
      { Cust_Type: "New Customer", count: 6, closed_fiscal_quarter: "2023-Q2" },
      { Cust_Type: "Existing Customer", count: 17, closed_fiscal_quarter: "2023-Q2" }
    ],
    accountIndustries: [
      { Acct_Industry: "Technology Sales", count: 18, closed_fiscal_quarter: "2024-Q1" },
      { Acct_Industry: "Technology Svcs", count: 3, closed_fiscal_quarter: "2024-Q1" },
      { Acct_Industry: "Construction", count: 4, closed_fiscal_quarter: "2024-Q1" },
      { Acct_Industry: "Private Equity", count: 1, closed_fiscal_quarter: "2024-Q1" },
      { Acct_Industry: "Wholesalers", count: 2, closed_fiscal_quarter: "2024-Q1" },
      { Acct_Industry: "Retail", count: 1, closed_fiscal_quarter: "2024-Q1" },
      // 2023-Q4 data
      { Acct_Industry: "Technology Sales", count: 15, closed_fiscal_quarter: "2023-Q4" },
      { Acct_Industry: "Technology Svcs", count: 2, closed_fiscal_quarter: "2023-Q4" },
      { Acct_Industry: "Construction", count: 3, closed_fiscal_quarter: "2023-Q4" },
      { Acct_Industry: "Private Equity", count: 2, closed_fiscal_quarter: "2023-Q4" },
      { Acct_Industry: "Wholesalers", count: 1, closed_fiscal_quarter: "2023-Q4" },
      // 2023-Q3 data
      { Acct_Industry: "Technology Sales", count: 20, closed_fiscal_quarter: "2023-Q3" },
      { Acct_Industry: "Technology Svcs", count: 4, closed_fiscal_quarter: "2023-Q3" },
      { Acct_Industry: "Construction", count: 5, closed_fiscal_quarter: "2023-Q3" },
      { Acct_Industry: "Private Equity", count: 3, closed_fiscal_quarter: "2023-Q3" },
      { Acct_Industry: "Retail", count: 2, closed_fiscal_quarter: "2023-Q3" },
      // 2023-Q2 data
      { Acct_Industry: "Technology Sales", count: 12, closed_fiscal_quarter: "2023-Q2" },
      { Acct_Industry: "Technology Svcs", count: 3, closed_fiscal_quarter: "2023-Q2" },
      { Acct_Industry: "Construction", count: 4, closed_fiscal_quarter: "2023-Q2" },
      { Acct_Industry: "Wholesalers", count: 3, closed_fiscal_quarter: "2023-Q2" },
      { Acct_Industry: "Retail", count: 1, closed_fiscal_quarter: "2023-Q2" }
    ],
    teams: [
      { Team: "Asia Pac", count: 8, closed_fiscal_quarter: "2024-Q1" },
      { Team: "Enterprise", count: 4, closed_fiscal_quarter: "2024-Q1" },
      { Team: "Europe", count: 12, closed_fiscal_quarter: "2024-Q1" },
      { Team: "Latin America", count: 5, closed_fiscal_quarter: "2024-Q1" },
      // 2023-Q4 data
      { Team: "Asia Pac", count: 6, closed_fiscal_quarter: "2023-Q4" },
      { Team: "Enterprise", count: 5, closed_fiscal_quarter: "2023-Q4" },
      { Team: "Europe", count: 9, closed_fiscal_quarter: "2023-Q4" },
      { Team: "Latin America", count: 3, closed_fiscal_quarter: "2023-Q4" },
      // 2023-Q3 data
      { Team: "Asia Pac", count: 10, closed_fiscal_quarter: "2023-Q3" },
      { Team: "Enterprise", count: 7, closed_fiscal_quarter: "2023-Q3" },
      { Team: "Europe", count: 11, closed_fiscal_quarter: "2023-Q3" },
      { Team: "Latin America", count: 6, closed_fiscal_quarter: "2023-Q3" },
      // 2023-Q2 data
      { Team: "Asia Pac", count: 5, closed_fiscal_quarter: "2023-Q2" },
      { Team: "Enterprise", count: 3, closed_fiscal_quarter: "2023-Q2" },
      { Team: "Europe", count: 10, closed_fiscal_quarter: "2023-Q2" },
      { Team: "Latin America", count: 5, closed_fiscal_quarter: "2023-Q2" }
    ],
    acvRanges: [
      { ACV_Range: "$10K-25K", count: 2, closed_fiscal_quarter: "2024-Q1" },
      { ACV_Range: "$25K-50K", count: 7, closed_fiscal_quarter: "2024-Q1" },
      { ACV_Range: "$50K-100K", count: 4, closed_fiscal_quarter: "2024-Q1" },
      { ACV_Range: ">$250K", count: 16, closed_fiscal_quarter: "2024-Q1" },
      // 2023-Q4 data
      { ACV_Range: "$10K-25K", count: 1, closed_fiscal_quarter: "2023-Q4" },
      { ACV_Range: "$25K-50K", count: 5, closed_fiscal_quarter: "2023-Q4" },
      { ACV_Range: "$50K-100K", count: 6, closed_fiscal_quarter: "2023-Q4" },
      { ACV_Range: ">$250K", count: 11, closed_fiscal_quarter: "2023-Q4" },
      // 2023-Q3 data
      { ACV_Range: "$10K-25K", count: 3, closed_fiscal_quarter: "2023-Q3" },
      { ACV_Range: "$25K-50K", count: 8, closed_fiscal_quarter: "2023-Q3" },
      { ACV_Range: "$50K-100K", count: 7, closed_fiscal_quarter: "2023-Q3" },
      { ACV_Range: ">$250K", count: 16, closed_fiscal_quarter: "2023-Q3" },
      // 2023-Q2 data
      { ACV_Range: "$10K-25K", count: 2, closed_fiscal_quarter: "2023-Q2" },
      { ACV_Range: "$25K-50K", count: 6, closed_fiscal_quarter: "2023-Q2" },
      { ACV_Range: "$50K-100K", count: 5, closed_fiscal_quarter: "2023-Q2" },
      { ACV_Range: ">$250K", count: 10, closed_fiscal_quarter: "2023-Q2" }
    ]
  };
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async () => {
    const data = await fetchData();
    return data;
  }
);

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data';
      });
  }
});

export default dashboardSlice.reducer; 