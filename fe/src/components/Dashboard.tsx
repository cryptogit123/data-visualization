import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
  keyframes,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { AppDispatch, RootState } from "../store";
import { fetchDashboardData } from "../store/dashboardSlice";
import BarChart from "./charts/BarChart";
import DoughnutChart from "./charts/DoughnutChart";
import LineChart from "./charts/LineChart";
import ChartTypeSelector from "./ChartTypeSelector";
import type {
  CustomerTypeData,
  AccountIndustryData,
  TeamData,
  ACVRangeData,
} from "../types";
import { ChartType } from "../types";
import { chartThemes } from "../constants/chartThemes";
import ChartSkeleton from './ChartSkeleton';

// Define animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

type ChartTypeMap = {
  customerTypes: ChartType;
  accountIndustries: ChartType;
  teamDistribution: ChartType;
  acvRanges: ChartType;
};

interface ChartData {
  label: string;
  value: number;
}

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.dashboard);
  const [selectedQuarter, setSelectedQuarter] = useState<string>("");
  const [selectedColorTheme, setSelectedColorTheme] = useState<string>("modern");

  const [chartTypes, setChartTypes] = useState<ChartTypeMap>({
    customerTypes: ChartType.DOUGHNUT,
    accountIndustries: ChartType.BAR,
    teamDistribution: ChartType.DOUGHNUT,
    acvRanges: ChartType.BAR,
  });

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  useEffect(() => {
    if (data?.customerTypes.length) {
      const quarters = [
        ...new Set<string>(
          data.customerTypes.map(
            (item: CustomerTypeData) => item.closed_fiscal_quarter
          )
        ),
      ];
      const sortedQuarters = quarters.sort().reverse();
      setSelectedQuarter(sortedQuarters[0] || "");
    }
  }, [data]);

  if (loading) {
    return (
      <Box sx={{ 
        p: 4, 
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        background: `linear-gradient(135deg, 
          ${alpha(theme.palette.primary.dark, 0.1)} 0%, 
          ${alpha(theme.palette.background.default, 0.95)} 100%)`,
        transition: 'all 0.3s ease',
        animation: `${fadeIn} 0.6s ease-out`
      }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 900,
            mb: 4,
            background: `linear-gradient(45deg, 
              ${theme.palette.primary.main}, 
              ${theme.palette.secondary.main}, 
              ${theme.palette.primary.light})`,
            backgroundSize: '200% 200%',
            animation: `${shimmer} 3s linear infinite`,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
            letterSpacing: '-0.5px'
          }}
        >
          Data Visualization Dashboard
        </Typography>
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)'
          },
          gap: 3
        }}>
          {[...Array(4)].map((_, index) => (
            <Card
              key={index}
              sx={{ 
                height: '100%',
                backgroundColor: alpha(theme.palette.background.paper, 0.1),
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <ChartSkeleton />
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!data || !selectedQuarter) {
    return null;
  }

  const quarters = [
    ...new Set<string>(
      data.customerTypes.map(
        (item: CustomerTypeData) => item.closed_fiscal_quarter
      )
    ),
  ].sort().reverse();

  // Filter data by selected quarter
  const filterByQuarter = <T extends { closed_fiscal_quarter: string }>(
    items: T[]
  ): T[] => {
    return items.filter(
      (item) => item.closed_fiscal_quarter === selectedQuarter
    );
  };

  // Transform data for charts
  const customerTypeData: ChartData[] = filterByQuarter<CustomerTypeData>(data.customerTypes).map(
    (item) => ({
      label: item.Cust_Type,
      value: item.count,
    })
  );

  const industryData: ChartData[] = filterByQuarter<AccountIndustryData>(data.accountIndustries).map(
    (item) => ({
      label: item.Acct_Industry,
      value: item.count,
    })
  );

  const teamData: ChartData[] = filterByQuarter<TeamData>(data.teams).map(
    (item) => ({
      label: item.Team,
      value: item.count,
    })
  );

  const acvData: ChartData[] = filterByQuarter<ACVRangeData>(data.acvRanges).map(
    (item) => ({
      label: item.ACV_Range,
      value: item.count,
    })
  );

  const handleQuarterChange = (event: SelectChangeEvent) => {
    setSelectedQuarter(event.target.value);
  };

  const handleColorThemeChange = (event: SelectChangeEvent) => {
    setSelectedColorTheme(event.target.value);
  };

  const renderChart = (
    type: ChartType,
    data: { label: string; value: number }[]
  ) => {
    const props = {
      data,
      colors: chartThemes[selectedColorTheme].colors,
    };

    switch (type) {
      case ChartType.BAR:
        return <BarChart {...props} />;
      case ChartType.LINE:
        return <LineChart {...props} />;
      case ChartType.DOUGHNUT:
        return <DoughnutChart {...props} />;
      default:
        return <BarChart {...props} />;
    }
  };

  // Update the shared card styles for all chart cards
  const sharedCardStyles = (accentColor: string) => ({
    height: '100%',
    minHeight: { xs: '400px', sm: '450px' },
    backgroundColor: alpha(theme.palette.background.paper, 0.1),
    backdropFilter: 'blur(10px)',
    borderRadius: { xs: 2, sm: 3 },
    border: `1px solid ${alpha(accentColor, 0.1)}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(135deg, ${alpha(accentColor, 0.1)} 0%, transparent 100%)`,
      opacity: 0,
      transition: 'opacity 0.3s ease'
    },
    '&:hover': {
      transform: { xs: 'none', sm: 'translateY(-8px) scale(1.02)' },
      boxShadow: { xs: 'none', sm: `0 20px 40px ${alpha(theme.palette.common.black, 0.2)}` },
      border: `1px solid ${alpha(accentColor, 0.3)}`,
      '&:before': {
        opacity: 1
      }
    }
  });

  const sharedContentStyles = {
    flex: 1, 
    display: 'flex', 
    flexDirection: 'column',
    p: { xs: 2, sm: 3 }
  };

  const sharedHeaderStyles = {
    display: 'flex', 
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'space-between', 
    alignItems: { xs: 'stretch', sm: 'center' },
    gap: { xs: 2, sm: 0 },
    mb: 3
  };

  const sharedTitleStyles = (accentColor: string) => ({
    fontSize: { xs: '1.1rem', sm: '1.25rem' },
    fontWeight: 600,
    color: theme.palette.text.primary,
    textAlign: { xs: 'center', sm: 'left' },
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    '&:before, &:after': {
      content: '""',
      display: { xs: 'none', sm: 'block' },
      height: '2px',
      flex: 1,
      background: `linear-gradient(90deg, ${alpha(accentColor, 0.5)}, transparent)`
    },
    '&:before': {
      marginRight: 2,
      transform: 'scaleX(-1)' // Flip the gradient for the left side
    },
    '&:after': {
      marginLeft: 2
    }
  });

  const sharedChartContainerStyles = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease',
    transform: 'scale(0.9)',
    '@media (min-width: 600px)': {
      transform: 'scale(1)',
    },
    '&:hover': {
      transform: { xs: 'scale(0.9)', sm: 'scale(1.02)' }
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        background: `linear-gradient(135deg, 
      ${alpha(theme.palette.primary.dark, 0.1)} 0%, 
      ${alpha(theme.palette.background.default, 0.95)} 100%)`,
        transition: "all 0.3s ease",
        animation: `${fadeIn} 0.6s ease-out`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },  // Stack on mobile
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          mb: { xs: 3, md: 4 },
          gap: 2,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" },  // Responsive font size
            fontWeight: 900,
            textAlign: { xs: "center", md: "left" },  // Center on mobile
            background: `linear-gradient(45deg, 
              ${theme.palette.primary.main}, 
              ${theme.palette.secondary.main}, 
              ${theme.palette.primary.light})`,
            backgroundSize: "200% 200%",
            animation: `${shimmer} 3s linear infinite`,
            backgroundClip: "text",
            textFillColor: "transparent",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.3)}`,
            letterSpacing: "-0.5px",
          }}
        >
          Data Visualization Dashboard
        </Typography>
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", sm: "row" },  // Stack on mobile
            gap: 2,
            width: { xs: "100%", md: "auto" }  // Full width on mobile
          }}
        >
          <FormControl
            fullWidth  // Full width on mobile
            sx={{
              minWidth: { sm: 200 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.1),
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.background.paper, 0.2),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                  boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              },
            }}
          >
            <InputLabel id="quarter-select-label">Fiscal Quarter</InputLabel>
            <Select
              labelId="quarter-select-label"
              value={selectedQuarter}
              label="Fiscal Quarter"
              onChange={handleQuarterChange}
            >
              {quarters.map((quarter) => (
                <MenuItem key={quarter} value={quarter}>
                  {quarter}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth  // Full width on mobile
            sx={{
              minWidth: { sm: 200 },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.1),
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.background.paper, 0.2),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
                  boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              },
            }}
          >
            <InputLabel id="theme-select-label">Color Theme</InputLabel>
            <Select
              labelId="theme-select-label"
              value={selectedColorTheme}
              label="Color Theme"
              onChange={handleColorThemeChange}
            >
              {Object.entries(chartThemes).map(([key, theme]) => (
                <MenuItem key={key} value={key}>
                  {theme.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(auto-fit, minmax(300px, 1fr))",
            md: "repeat(2, 1fr)",
          },
          gap: { xs: 2, sm: 3 },
        }}
      >
        {/* Customer Type Chart */}
        <Card sx={sharedCardStyles(theme.palette.primary.main)}>
          <CardContent sx={sharedContentStyles}>
            <Box sx={sharedHeaderStyles}>
              <Typography sx={sharedTitleStyles(theme.palette.primary.main)}>
                Customer Types Distribution
              </Typography>
              <ChartTypeSelector
                value={chartTypes.customerTypes}
                onChange={(value) => setChartTypes(prev => ({ ...prev, customerTypes: value }))}
              />
            </Box>
            <Box sx={sharedChartContainerStyles}>
              {renderChart(chartTypes.customerTypes, customerTypeData)}
            </Box>
          </CardContent>
        </Card>

        {/* Account Industry Chart */}
        <Card sx={sharedCardStyles(theme.palette.secondary.main)}>
          <CardContent sx={sharedContentStyles}>
            <Box sx={sharedHeaderStyles}>
              <Typography sx={sharedTitleStyles(theme.palette.secondary.main)}>
                Account Industries
              </Typography>
              <ChartTypeSelector
                value={chartTypes.accountIndustries}
                onChange={(value) => setChartTypes(prev => ({ ...prev, accountIndustries: value }))}
              />
            </Box>
            <Box sx={sharedChartContainerStyles}>
              {renderChart(chartTypes.accountIndustries, industryData)}
            </Box>
          </CardContent>
        </Card>

        {/* Team Chart */}
        <Card sx={sharedCardStyles(theme.palette.success.main)}>
          <CardContent sx={sharedContentStyles}>
            <Box sx={sharedHeaderStyles}>
              <Typography sx={sharedTitleStyles(theme.palette.success.main)}>
                Team Distribution
              </Typography>
              <ChartTypeSelector
                value={chartTypes.teamDistribution}
                onChange={(value) => setChartTypes(prev => ({ ...prev, teamDistribution: value }))}
              />
            </Box>
            <Box sx={sharedChartContainerStyles}>
              {renderChart(chartTypes.teamDistribution, teamData)}
            </Box>
          </CardContent>
        </Card>

        {/* ACV Range Chart */}
        <Card sx={sharedCardStyles(theme.palette.info.main)}>
          <CardContent sx={sharedContentStyles}>
            <Box sx={sharedHeaderStyles}>
              <Typography sx={sharedTitleStyles(theme.palette.info.main)}>
                ACV Ranges
              </Typography>
              <ChartTypeSelector
                value={chartTypes.acvRanges}
                onChange={(value) => setChartTypes(prev => ({ ...prev, acvRanges: value }))}
              />
            </Box>
            <Box sx={sharedChartContainerStyles}>
              {renderChart(chartTypes.acvRanges, acvData)}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
