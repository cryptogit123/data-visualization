import React from 'react';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  useTheme,
  alpha
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { ChartType } from '../types';

interface ChartTypeSelectorProps {
  value: ChartType;
  onChange: (value: ChartType) => void;
  label?: string;
}

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
  value,
  onChange,
  label = 'Chart Type'
}) => {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as ChartType);
  };

  return (
    <FormControl 
      size="small"
      sx={{ 
        minWidth: 120,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.1),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: alpha(theme.palette.background.paper, 0.2),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
            boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.2)}`
          }
        }
      }}
    >
      <InputLabel id="chart-type-select-label">{label}</InputLabel>
      <Select
        labelId="chart-type-select-label"
        value={value}
        label={label}
        onChange={handleChange}
      >
        <MenuItem value={ChartType.BAR}>Bar Chart</MenuItem>
        <MenuItem value={ChartType.LINE}>Line Chart</MenuItem>
        <MenuItem value={ChartType.DOUGHNUT}>Doughnut Chart</MenuItem>
      </Select>
    </FormControl>
  );
};

export default ChartTypeSelector; 