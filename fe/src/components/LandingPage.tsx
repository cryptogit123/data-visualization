import React from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  alpha,
  Container,
  Stack,
} from "@mui/material";
import { keyframes } from "@mui/system";
import {
  BarChart as BarChartIcon,
  DonutLarge,
  Timeline,
  TrendingUp,
  ArrowForward,
  type SvgIconComponent,
} from "@mui/icons-material";

// Define animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-10px) rotate(2deg);
  }
  75% {
    transform: translateY(5px) rotate(-2deg);
  }
  100% {
    transform: translateY(0px) rotate(0deg);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
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

interface FeatureCardProps {
  icon: SvgIconComponent;
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: "relative",
        p: 3,
        borderRadius: 4,
        backgroundColor: alpha(theme.palette.background.paper, 0.05),
        backdropFilter: "blur(10px)",
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        animation: `${fadeInUp} 0.6s ease-out ${delay}s`,
        animationFillMode: "both",
        "&:hover": {
          transform: "translateY(-8px)",
          backgroundColor: alpha(theme.palette.background.paper, 0.1),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          "& .icon-wrapper": {
            transform: "scale(1.1) rotate(5deg)",
            backgroundColor: alpha(theme.palette.primary.main, 0.2),
          },
          "&::before": {
            transform: "rotate(45deg) translate(100%, -100%)",
          },
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "200%",
          height: "200%",
          background: `linear-gradient(45deg, transparent, ${alpha(
            theme.palette.primary.main,
            0.1
          )}, transparent)`,
          transform: "rotate(45deg) translate(-100%, 100%)",
          transition: "transform 0.6s ease",
        },
      }}
    >
      <Box
        className="icon-wrapper"
        sx={{
          width: 60,
          height: 60,
          borderRadius: 3,
          backgroundColor: alpha(theme.palette.primary.main, 0.1),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          transition: "all 0.3s ease",
        }}
      >
        <Icon
          sx={{
            fontSize: 32,
            color: theme.palette.primary.main,
          }}
        />
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 1,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          backgroundClip: "text",
          textFillColor: "transparent",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: alpha(theme.palette.text.primary, 0.7),
          lineHeight: 1.6,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        background: `radial-gradient(circle at 10% 20%, ${alpha(
          theme.palette.primary.dark,
          0.15
        )} 0%, transparent 20%),
        radial-gradient(circle at 90% 80%, ${alpha(
          theme.palette.secondary.dark,
          0.15
        )} 0%, transparent 20%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {[...Array(3)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: "40vw",
              height: "40vw",
              borderRadius: "50%",
              background: `linear-gradient(45deg, ${alpha(
                theme.palette.primary.main,
                0.03
              )}, ${alpha(theme.palette.secondary.main, 0.03)})`,
              filter: "blur(80px)",
              animation: `${float} ${8 + i * 2}s ease-in-out infinite`,
              top: `${20 + i * 30}%`,
              left: `${(i * 40) % 90}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </Box>

      <Container maxWidth="lg" sx={{ position: "relative", py: 8 }}>
        <Stack spacing={6} alignItems="center" sx={{ textAlign: "center" }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.5rem", md: "4rem" },
              fontWeight: 800,
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
              maxWidth: "800px",
              position: "relative",
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
              mb: 2,
            }}
          >
            Transform Your Data into
            <br />
            Visual Insights
          </Typography>

          <Typography
            variant="h5"
            sx={{
              maxWidth: "600px",
              color: alpha(theme.palette.text.primary, 0.7),
              lineHeight: 1.8,
              animation: `${fadeInUp} 0.6s ease-out 0.2s`,
              animationFillMode: "both",
            }}
          >
            Create stunning, interactive visualizations that bring your data to life
            with our powerful dashboard tools.
          </Typography>

          <Button
            onClick={onEnter}
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            sx={{
              mt: 4,
              py: 2,
              px: 4,
              borderRadius: 3,
              fontSize: "1.1rem",
              textTransform: "none",
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundSize: "200% 200%",
              animation: `${pulse} 3s ease-in-out infinite`,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.3)}`,
              },
            }}
          >
            Explore Dashboard
          </Button>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 4,
              width: "100%",
              mt: 12,
            }}
          >
            <FeatureCard
              icon={BarChartIcon}
              title="Interactive Charts"
              description="Create dynamic bar charts that respond to user interactions and data updates in real-time."
              delay={0.3}
            />
            <FeatureCard
              icon={DonutLarge}
              title="Insightful Analytics"
              description="Transform complex data into clear, actionable insights with beautiful doughnut charts."
              delay={0.4}
            />
            <FeatureCard
              icon={Timeline}
              title="Trend Analysis"
              description="Track patterns and changes over time with sophisticated line charts and trend indicators."
              delay={0.5}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Smart Updates"
              description="Stay ahead with automatic data refreshes and intelligent visualization recommendations."
              delay={0.6}
            />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default LandingPage;
