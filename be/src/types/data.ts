/**
 * Common interface for all data types with shared properties
 */
export interface BaseDataItem {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
}

/**
 * Interface for Customer Type data
 */
export interface CustomerType extends BaseDataItem {
  Cust_Type: string;
}

/**
 * Interface for Account Industry data
 */
export interface AccountIndustry extends BaseDataItem {
  Acct_Industry: string;
  query_key?: string;
  Total_Quantity?: number | null;
}

/**
 * Interface for Team data
 */
export interface Team extends BaseDataItem {
  Team: string;
}

/**
 * Interface for ACV (Annual Contract Value) Range data
 */
export interface ACVRange extends BaseDataItem {
  ACV_Range: string;
}

/**
 * Interface for the combined dashboard data
 */
export interface DashboardData {
  customerTypes: CustomerType[];
  accountIndustries: AccountIndustry[];
  teams: Team[];
  acvRanges: ACVRange[];
}

/**
 * Interface for chart data
 */
export interface ChartData {
  labels: string[];
  values: number[];
  total: number;
}

/**
 * Type for fiscal quarters
 */
export type FiscalQuarter = '2023-Q3' | '2023-Q4' | '2024-Q1' | '2024-Q2';

/**
 * Type for ACV range values
 */
export type ACVRangeValue = '<$20K' | '$20K - 50K' | '$50K - 100K' | '$100K - 200K' | '>=$200K';

/**
 * Type for customer types
 */
export type CustomerTypeValue = 'New Customer' | 'Existing Customer';

/**
 * Type for team names
 */
export type TeamValue = 'Asia Pac' | 'Enterprise' | 'Europe' | 'Latin America' | 'North America'; 