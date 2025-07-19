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
    <Box sx={{ height: '100%', p: 2 }}>
      {/* Chart Title Skeleton */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 3
      }}>
        <Box
          sx={{
            width: '200px',
            height: '28px',
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
            width: '120px',
            height: '32px',
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
          height: 400,
          borderRadius: 2,
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
          p: 4
        }}>
          {[...Array(6)].map((_, index) => (
            <Box
              key={index}
              sx={{
                width: '40px',
                height: `${Math.random() * 60 + 20}%`,
                borderRadius: 1,
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