import React, { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { useTheme, Box } from '@mui/material';

interface BarChartProps {
  data: { label: string; value: number }[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  colors?: string[];
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 500,
  height = 300,
  margin = { top: 20, right: 30, bottom: 100, left: 60 }, // Increased bottom margin
  colors
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  // Define color palette
  const colorPalette = useMemo(() => colors || [
    '#FF6B6B', // Coral Red
    '#4ECDC4', // Turquoise
    '#45B7D1', // Sky Blue
    '#96CEB4', // Sage Green
    '#FFEEAD', // Cream Yellow
    '#D4A5A5', // Dusty Rose
    '#9A7AA0', // Muted Purple
    '#87A8A4', // Slate Green
    '#F9D5BB', // Peach
    '#A8E6CF'  // Mint Green
  ], [colors]);

  useEffect(() => {
    if (!data || !svgRef.current || !tooltipRef.current || !containerRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Create tooltip reference
    const tooltip = d3.select(tooltipRef.current)
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', theme.palette.background.paper)
      .style('color', theme.palette.text.primary)
      .style('padding', '12px')
      .style('border-radius', '8px')
      .style('font-size', '14px')
      .style('pointer-events', 'none')
      .style('z-index', '10000')
      .style('box-shadow', '0 4px 20px rgba(0, 0, 0, 0.15)')
      .style('border', `1px solid ${theme.palette.divider}`)
      .style('min-width', '120px')
      .style('max-width', '200px');

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Create SVG
    const svg = d3.select(svgRef.current);

    // Add gradient definitions
    const defs = svg.append('defs');
    
    data.forEach((_, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `bar-gradient-${i}`)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', '0%')
        .attr('y1', '100%')
        .attr('x2', '0%')
        .attr('y2', '0%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', colorPalette[i % colorPalette.length])
        .attr('stop-opacity', 0.7);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', colorPalette[i % colorPalette.length])
        .attr('stop-opacity', 1);
    });

    // Add bars with tooltips
    const bars = svg.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => x(d.label) || 0)
      .attr('y', height - margin.bottom)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', (_, i) => `url(#bar-gradient-${i})`)
      .attr('rx', 4)
      .attr('ry', 4)
      .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))');

    // Animate bars on initial render
    bars.transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attr('y', d => y(d.value))
      .attr('height', d => height - margin.bottom - y(d.value));

    // Add hover effects and tooltips
    bars.on('mouseover', function(event: MouseEvent, d: { label: string; value: number }) {
      // Highlight the bar
      d3.select(this)
        .style('filter', 'drop-shadow(0 8px 12px rgba(0, 0, 0, 0.2))')
        .style('opacity', 0.8);

      // Get container and bar positions
      const containerRect = containerRef.current?.getBoundingClientRect();
      const barElement = this as SVGRectElement;
      const barRect = barElement.getBoundingClientRect();
      
      if (!containerRect) return;

      // Show tooltip with content
      tooltip
        .style('visibility', 'visible')
        .html(`
          <div style="font-weight: 600; margin-bottom: 4px; color: ${theme.palette.text.primary}">${d.label}</div>
          <div style="color: ${theme.palette.text.secondary}">Value: ${d.value}</div>
        `);

      // Calculate tooltip position relative to container
      const tooltipWidth = tooltipRef.current?.offsetWidth || 0;
      const tooltipHeight = tooltipRef.current?.offsetHeight || 0;
      
      const tooltipLeft = barRect.left - containerRect.left + (barRect.width / 2) - (tooltipWidth / 2);
      const tooltipTop = barRect.top - containerRect.top - tooltipHeight - 8;

      // Position tooltip
      tooltip
        .style('left', `${tooltipLeft}px`)
        .style('top', `${tooltipTop}px`);
    })
    .on('mouseout', function() {
      // Reset bar style
      d3.select(this)
        .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))')
        .style('opacity', 1);

      // Hide tooltip
      tooltip.style('visibility', 'hidden');
    });

    // Add axes with styled appearance
    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .style('font-size', '12px');

    // Style the axis labels
    xAxis.selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('fill', theme.palette.text.secondary)
      .style('font-weight', '500')
      .attr('dx', '-0.8em')
      .attr('dy', '0.15em');

    xAxis.selectAll('line')
      .style('stroke', theme.palette.divider);

    xAxis.selectAll('path')
      .style('stroke', theme.palette.divider);

    const yAxis = svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .style('font-size', '12px');

    yAxis.selectAll('text')
      .style('fill', theme.palette.text.secondary)
      .style('font-weight', '500');

    yAxis.selectAll('line')
      .style('stroke', theme.palette.divider);

    yAxis.selectAll('path')
      .style('stroke', theme.palette.divider);

    // Add grid lines
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y)
        .tickSize(-width + margin.left + margin.right)
        .tickFormat(() => '')
      )
      .style('stroke-dasharray', '3,3')
      .style('stroke-opacity', 0.2);

  }, [data, width, height, margin, theme, colorPalette]);

  return (
    <Box 
      ref={containerRef} 
      sx={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        '& svg': {
          maxWidth: '100%',
          height: '100%'
        }
      }}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ maxWidth: '100%', height: '100%' }}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
      />
      <div 
        ref={tooltipRef} 
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          zIndex: 10000,
          visibility: 'hidden'
        }}
      />
    </Box>
  );
};

export default BarChart; 