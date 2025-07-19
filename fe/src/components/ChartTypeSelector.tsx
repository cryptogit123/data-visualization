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
      fullWidth  // Full width on mobile
      sx={{ 
        minWidth: { xs: '100%', sm: 120 },  // Full width on mobile, fixed width on tablet and up
        maxWidth: { xs: '100%', sm: 200 },  // Limit maximum width
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.1),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          transition: 'all 0.3s ease',
          fontSize: { xs: '0.875rem', sm: '1rem' },  // Smaller font on mobile
          '& .MuiSelect-select': {
            padding: { xs: '0.5rem', sm: '0.75rem' },  // Smaller padding on mobile
          },
          '&:hover': {
            backgroundColor: alpha(theme.palette.background.paper, 0.2),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.5)}`,
            boxShadow: { 
              xs: 'none',  // No shadow on mobile
              sm: `0 0 15px ${alpha(theme.palette.primary.main, 0.2)}`
            }
          }
        },
        '& .MuiInputLabel-root': {
          fontSize: { xs: '0.875rem', sm: '1rem' }  // Smaller label on mobile
        },
        '& .MuiMenuItem-root': {
          fontSize: { xs: '0.875rem', sm: '1rem' }  // Smaller menu items on mobile
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