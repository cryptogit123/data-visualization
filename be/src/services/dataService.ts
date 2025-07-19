import fs from 'fs';
import path from 'path';
import { 
  CustomerType, 
  AccountIndustry, 
  Team, 
  ACVRange, 
  DashboardData,
  FiscalQuarter,
  ChartData
} from '../types/data';

/**
 * Service class for handling data operations
 */
export class DataService {
  private dataDir: string;

  constructor() {
    this.dataDir = path.join(__dirname, '..', 'data');
  }

  /**
   * Read and parse a JSON file
   * @param filename The name of the JSON file to read
   * @returns Parsed JSON data
   */
  private async readJsonFile<T>(filename: string): Promise<T> {
    try {
      const filePath = path.join(this.dataDir, filename);
      const data = await fs.promises.readFile(filePath, 'utf8');
      return JSON.parse(data) as T;
    } catch (error) {
      console.error(`Error reading file ${filename}:`, error);
      throw new Error(`Failed to read ${filename}`);
    }
  }

  /**
   * Get all dashboard data
   * @returns Combined dashboard data from all sources
   */
  public async getDashboardData(): Promise<DashboardData> {
    try {
      const [customerTypes, accountIndustries, teams, acvRanges] = await Promise.all([
        this.readJsonFile<CustomerType[]>('customer-type.json'),
        this.readJsonFile<AccountIndustry[]>('account-industry.json'),
        this.readJsonFile<Team[]>('team.json'),
        this.readJsonFile<ACVRange[]>('acv-range.json')
      ]);

      return {
        customerTypes,
        accountIndustries,
        teams,
        acvRanges
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw new Error('Failed to get dashboard data');
    }
  }

  /**
   * Get customer type data
   * @param quarter Optional fiscal quarter filter
   * @returns Array of customer type data
   */
  public async getCustomerTypes(quarter?: FiscalQuarter): Promise<CustomerType[]> {
    const data = await this.readJsonFile<CustomerType[]>('customer-type.json');
    return quarter ? data.filter(item => item.closed_fiscal_quarter === quarter) : data;
  }

  /**
   * Get account industry data
   * @param quarter Optional fiscal quarter filter
   * @returns Array of account industry data
   */
  public async getAccountIndustries(quarter?: FiscalQuarter): Promise<AccountIndustry[]> {
    const data = await this.readJsonFile<AccountIndustry[]>('account-industry.json');
    return quarter ? data.filter(item => item.closed_fiscal_quarter === quarter) : data;
  }

  /**
   * Get team data
   * @param quarter Optional fiscal quarter filter
   * @returns Array of team data
   */
  public async getTeams(quarter?: FiscalQuarter): Promise<Team[]> {
    const data = await this.readJsonFile<Team[]>('team.json');
    return quarter ? data.filter(item => item.closed_fiscal_quarter === quarter) : data;
  }

  /**
   * Get ACV range data
   * @param quarter Optional fiscal quarter filter
   * @returns Array of ACV range data
   */
  public async getACVRanges(quarter?: FiscalQuarter): Promise<ACVRange[]> {
    const data = await this.readJsonFile<ACVRange[]>('acv-range.json');
    return quarter ? data.filter(item => item.closed_fiscal_quarter === quarter) : data;
  }

  /**
   * Get total ACV for a specific quarter
   * @param quarter Fiscal quarter
   * @returns Total ACV value
   */
  public async getTotalACV(quarter: FiscalQuarter): Promise<number> {
    const data = await this.getACVRanges(quarter);
    return data.reduce((sum, item) => sum + item.acv, 0);
  }

  /**
   * Get total count for a specific quarter
   * @param quarter Fiscal quarter
   * @returns Total count value
   */
  public async getTotalCount(quarter: FiscalQuarter): Promise<number> {
    const data = await this.getACVRanges(quarter);
    return data.reduce((sum, item) => sum + item.count, 0);
  }

  /**
   * Get quarter-over-quarter growth
   * @param currentQuarter Current fiscal quarter
   * @param metric Metric to compare ('acv' or 'count')
   * @returns Growth percentage
   */
  public async getQuarterOverQuarterGrowth(
    currentQuarter: FiscalQuarter,
    metric: 'acv' | 'count'
  ): Promise<number> {
    const quarters: FiscalQuarter[] = ['2023-Q3', '2023-Q4', '2024-Q1', '2024-Q2'];
    const currentIndex = quarters.indexOf(currentQuarter);
    
    if (currentIndex <= 0) return 0;
    
    const previousQuarter = quarters[currentIndex - 1];
    const currentData = await this.getACVRanges(currentQuarter);
    const previousData = await this.getACVRanges(previousQuarter);
    
    const currentTotal = currentData.reduce((sum, item) => sum + item[metric], 0);
    const previousTotal = previousData.reduce((sum, item) => sum + item[metric], 0);
    
    return previousTotal === 0 ? 0 : ((currentTotal - previousTotal) / previousTotal) * 100;
  }

  /**
   * Transform data for chart visualization
   * @param data Array of data items
   * @param labelKey Key to use for labels
   * @param valueKey Key to use for values
   * @returns Transformed chart data
   */
  private transformForChart<T extends { [key: string]: any }>(
    data: T[],
    labelKey: keyof T,
    valueKey: keyof T
  ): ChartData {
    return {
      labels: data.map(item => item[labelKey] as string),
      values: data.map(item => item[valueKey] as number),
      total: data.reduce((sum, item) => sum + (item[valueKey] as number), 0)
    };
  }

  /**
   * Get customer type data formatted for charts
   * @param quarter Optional fiscal quarter filter
   * @returns Formatted chart data
   */
  public async getCustomerTypeChartData(quarter?: FiscalQuarter): Promise<ChartData> {
    const data = await this.getCustomerTypes(quarter);
    return this.transformForChart(data, 'Cust_Type', 'count');
  }

  /**
   * Get account industry data formatted for charts
   * @param quarter Optional fiscal quarter filter
   * @returns Formatted chart data
   */
  public async getAccountIndustryChartData(quarter?: FiscalQuarter): Promise<ChartData> {
    const data = await this.getAccountIndustries(quarter);
    return this.transformForChart(data, 'Acct_Industry', 'count');
  }

  /**
   * Get team data formatted for charts
   * @param quarter Optional fiscal quarter filter
   * @returns Formatted chart data
   */
  public async getTeamChartData(quarter?: FiscalQuarter): Promise<ChartData> {
    const data = await this.getTeams(quarter);
    return this.transformForChart(data, 'Team', 'count');
  }

  /**
   * Get ACV range data formatted for charts
   * @param quarter Optional fiscal quarter filter
   * @returns Formatted chart data
   */
  public async getACVRangeChartData(quarter?: FiscalQuarter): Promise<ChartData> {
    const data = await this.getACVRanges(quarter);
    return this.transformForChart(data, 'ACV_Range', 'acv');
  }

  /**
   * Get all chart data for dashboard
   * @param quarter Optional fiscal quarter filter
   * @returns Object containing all chart data
   */
  public async getAllChartData(quarter?: FiscalQuarter): Promise<{
    customerTypes: ChartData;
    accountIndustries: ChartData;
    teams: ChartData;
    acvRanges: ChartData;
  }> {
    return {
      customerTypes: await this.getCustomerTypeChartData(quarter),
      accountIndustries: await this.getAccountIndustryChartData(quarter),
      teams: await this.getTeamChartData(quarter),
      acvRanges: await this.getACVRangeChartData(quarter)
    };
  }
} 