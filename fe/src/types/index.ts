export interface CustomerTypeData {
  Cust_Type: string;
  count: number;
  closed_fiscal_quarter: string;
}

export interface AccountIndustryData {
  Acct_Industry: string;
  count: number;
  closed_fiscal_quarter: string;
}

export interface TeamData {
  Team: string;
  count: number;
  closed_fiscal_quarter: string;
}

export interface ACVRangeData {
  ACV_Range: string;
  count: number;
  closed_fiscal_quarter: string;
}

export type ChartColorTheme = {
  name: string;
  colors: string[];
};

export type ChartColorThemes = {
  [key: string]: ChartColorTheme;
};

export const ChartType = {
  BAR: 'bar',
  LINE: 'line',
  DOUGHNUT: 'doughnut'
} as const;

export type ChartType = typeof ChartType[keyof typeof ChartType];

// Combined data interface
export interface DashboardData {
  customerTypes: CustomerTypeData[];
  accountIndustries: AccountIndustryData[];
  teams: TeamData[];
  acvRanges: ACVRangeData[];
}

// Chart data interface
export interface ChartDataItem {
  label: string;
  value: number;
}

export interface ChartData {
  data: ChartDataItem[];
  title: string;
} 