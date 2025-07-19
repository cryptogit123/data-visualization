import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';

const router = Router();
const dashboardController = new DashboardController();

/**
 * @route GET /api/dashboard
 * @desc Get all dashboard data
 */
router.get('/', dashboardController.getAllData);

/**
 * @route GET /api/dashboard/charts
 * @desc Get all chart data
 */
router.get('/charts', dashboardController.getAllChartData);

/**
 * @route GET /api/dashboard/charts/customer-types
 * @desc Get customer type chart data
 */
router.get('/charts/customer-types', dashboardController.getCustomerTypeChartData);

/**
 * @route GET /api/dashboard/charts/account-industries
 * @desc Get account industry chart data
 */
router.get('/charts/account-industries', dashboardController.getAccountIndustryChartData);

/**
 * @route GET /api/dashboard/charts/teams
 * @desc Get team chart data
 */
router.get('/charts/teams', dashboardController.getTeamChartData);

/**
 * @route GET /api/dashboard/charts/acv-ranges
 * @desc Get ACV range chart data
 */
router.get('/charts/acv-ranges', dashboardController.getACVRangeChartData);

/**
 * @route GET /api/dashboard/customer-types
 * @desc Get customer type data
 */
router.get('/customer-types', dashboardController.getCustomerTypes);

/**
 * @route GET /api/dashboard/account-industries
 * @desc Get account industry data
 */
router.get('/account-industries', dashboardController.getAccountIndustries);

/**
 * @route GET /api/dashboard/teams
 * @desc Get team data
 */
router.get('/teams', dashboardController.getTeams);

/**
 * @route GET /api/dashboard/acv-ranges
 * @desc Get ACV range data
 */
router.get('/acv-ranges', dashboardController.getACVRanges);

export default router; 