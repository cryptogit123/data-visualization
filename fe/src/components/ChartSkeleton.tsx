import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { keyframes } from '@mui/system';

const shimmerAnimation = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const ChartSkeleton: React.FC = () => {
  const theme = useTheme();

  // Mix background and primary colors for a more subtle effect
  const shimmerGradient = `linear-gradient(90deg,
    ${alpha(theme.palette.background.paper, 0.05)} 0,
    ${alpha(theme.palette.background.paper, 0.15)} 50%,
    ${alpha(theme.palette.background.paper, 0.05)} 100%
  )`;

  const baseColor = alpha(
    theme.palette.mode === 'dark' 
      ? theme.palette.grey[800] 
      : theme.palette.grey[300],
    0.2
  );

  return (
    <Box sx={{ 
      height: '100%', 
      p: { xs: 1.5, sm: 2 }  // Less padding on mobile
    }}>
      {/* Chart Title Skeleton */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },  // Stack on mobile
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 2, sm: 0 },  // Add gap when stacked
        mb: { xs: 2, sm: 3 }  // Less margin on mobile
      }}>
        <Box
          sx={{
            width: { xs: '100%', sm: '200px' },  // Full width on mobile
            height: { xs: '24px', sm: '28px' },  // Smaller height on mobile
            borderRadius: 1,
            backgroundColor: baseColor,
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: shimmerGradient,
              animation: `${shimmerAnimation} 1.5s infinite`,
              backgroundSize: '1000px 100%',
            }
          }}
        />
        <Box
          sx={{
            width: { xs: '100%', sm: '120px' },  // Full width on mobile
            height: { xs: '28px', sm: '32px' },  // Smaller height on mobile
            borderRadius: 1,
            backgroundColor: baseColor,
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: shimmerGradient,
              animation: `${shimmerAnimation} 1.5s infinite`,
              backgroundSize: '1000px 100%',
            }
          }}
        />
      </Box>

      {/* Chart Area Skeleton */}
      <Box
        sx={{
          height: { xs: 300, sm: 400 },  // Smaller height on mobile
          borderRadius: { xs: 1.5, sm: 2 },  // Smaller radius on mobile
          backgroundColor: baseColor,
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: shimmerGradient,
            animation: `${shimmerAnimation} 1.5s infinite`,
            backgroundSize: '1000px 100%',
          }
        }}
      >
        {/* Fake Chart Elements */}
        <Box sx={{ 
          display: 'flex',
          height: '100%',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          p: { xs: 2, sm: 4 }  // Less padding on mobile
        }}>
          {[...Array(6)].map((_, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: '20px', sm: '40px' },  // Smaller bars on mobile
                height: `${Math.random() * 60 + 20}%`,
                borderRadius: { xs: 0.5, sm: 1 },  // Smaller radius on mobile
                backgroundColor: alpha(theme.palette.grey[700], 0.3),
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: shimmerGradient,
                  animation: `${shimmerAnimation} 1.5s infinite`,
                  backgroundSize: '1000px 100%',
                }
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ChartSkeleton; 