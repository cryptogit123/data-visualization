import { Request, Response } from 'express';
import { DataService } from '../services/dataService';
import { FiscalQuarter } from '../types/data';

/**
 * Controller class for handling dashboard-related requests
 */
export class DashboardController {
  private dataService: DataService;

  constructor() {
    this.dataService = new DataService();
  }

  /**
   * Get all dashboard data
   * @param req Express request object
   * @param res Express response object
   */
  public getAllData = async (req: Request, res: Response): Promise<void> => {
    try {
      const quarter = req.query.quarter as FiscalQuarter | undefined;
      const data = await this.dataService.getDashboardData();
      res.json(data);
    } catch (error) {
      console.error('Error in getAllData:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Get all chart data
   * @param req Express request object
   * @param res Express response object
   */
  public getAllChartData = async (req: Request, res: Response): Promise<void> => {
    try {
      const quarter = req.query.quarter as FiscalQuarter | undefined;
      const data = await this.dataService.getAllChartData(quarter);
      res.json(data);
    } catch (error) {
      console.error('Error in getAllChartData:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Get customer type chart data
   * @param req Express request object
   * @param res Express response object
   */
  public getCustomerTypeChartData = async (req: Request, res: Response): Promise<void> => {
    try {
      const quarter = req.query.quarter as FiscalQuarter | undefined;
      const data = await this.dataService.getCustomerTypeChartData(quarter);
      res.json(data);
    } catch (error) {
      console.error('Error in getCustomerTypeChartData:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Get account industry chart data
   * @param req Express request object
   * @param res Express response object
   */
  public getAccountIndustryChartData = async (req: Request, res: Response): Promise<void> => {
    try {
      const quarter = req.query.quarter as FiscalQuarter | undefined;
      const data = await this.dataService.getAccountIndustryChartData(quarter);
      res.json(data);
    } catch (error) {
      console.error('Error in getAccountIndustryChartData:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Get team chart data
   * @param req Express request object
   * @param res Express response object
   */
  public getTeamChartData = async (req: Request, res: Response): Promise<void> => {
    try {
      const quarter = req.query.quarter as FiscalQuarter | undefined;
      const data = await this.dataService.getTeamChartData(quarter);
      res.json(data);
    } catch (error) {
      console.error('Error in getTeamChartData:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Get ACV range chart data
   * @param req Express request object
   * @param res Express response object
   */
  public getACVRangeChartData = async (req: Request, res: Response): Promise<void> => {
    try {
      const quarter = req.query.quarter as FiscalQuarter | undefined;
      const data = await this.dataService.getACVRangeChartData(quarter);
      res.json(data);
    } catch (error) {
      console.error('Error in getACVRangeChartData:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Get customer type data
   * @param req Express request object
   * @param res Express response object
   */
  public getCustomerTypes = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.dataService.getCustomerTypes();
      res.json(data);
    } catch (error) {
      console.error('Error in getCustomerTypes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Get account industry data
   * @param req Express request object
   * @param res Express response object
   */
  public getAccountIndustries = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.dataService.getAccountIndustries();
      res.json(data);
    } catch (error) {
      console.error('Error in getAccountIndustries:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Get team data
   * @param req Express request object
   * @param res Express response object
   */
  public getTeams = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.dataService.getTeams();
      res.json(data);
    } catch (error) {
      console.error('Error in getTeams:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  /**
   * Get ACV range data
   * @param req Express request object
   * @param res Express response object
   */
  public getACVRanges = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.dataService.getACVRanges();
      res.json(data);
    } catch (error) {
      console.error('Error in getACVRanges:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
} 