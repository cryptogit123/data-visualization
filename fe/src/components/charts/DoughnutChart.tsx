/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { useTheme, Box } from '@mui/material';

interface DoughnutChartProps {
  data: { label: string; value: number }[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  colors?: string[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  width = 400,
  height = 400,
  margin = { top: 20, right: 20, bottom: 20, left: 20 },
  colors
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  // Define modern color palette
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
    if (!data || !svgRef.current || !tooltipRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Create tooltip reference
    const tooltip = d3.select(tooltipRef.current)
      .style('position', 'fixed')
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

    const radius = Math.min(width - margin.left - margin.right, height - margin.top - margin.bottom) / 2;
    const innerRadius = radius * 0.6; // Creates the doughnut hole

    // Create pie layout
    const pie = d3.pie<{ label: string; value: number }>()
      .value(d => d.value)
      .sort(null)
      .padAngle(0.02); // Add space between segments

    // Create arc generators
    const arc = d3.arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(4); // Rounded corners

    const hoverArc = d3.arc<d3.PieArcDatum<{ label: string; value: number }>>()
      .innerRadius(innerRadius)
      .outerRadius(radius * 1.05)
      .cornerRadius(4);

    // Create SVG
    const svg = d3.select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Add gradient definitions
    const defs = svg.append('defs');
    
    data.forEach((_, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `donut-gradient-${i}`)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', colorPalette[i % colorPalette.length])
        .attr('stop-opacity', 1);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', d3.color(colorPalette[i % colorPalette.length])?.brighter(0.5)?.toString() || colorPalette[i % colorPalette.length])
        .attr('stop-opacity', 1);
    });

    // Calculate total for percentage
    const total = d3.sum(data, d => d.value);

    // Add slices with animations
    const slices = svg.selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', d => arc(d))
      .attr('fill', (_, i) => `url(#donut-gradient-${i})`)
      .attr('stroke', theme.palette.background.paper)
      .style('stroke-width', '2px')
      .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))')
      .style('cursor', 'pointer')
      .on('mouseover', function(event: MouseEvent, d) {
        const data = d as d3.PieArcDatum<{ label: string; value: number }>;
        const percentage = ((data.data.value / total) * 100).toFixed(1);
        
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', () => hoverArc(data))
          .style('filter', 'drop-shadow(0 8px 12px rgba(0, 0, 0, 0.2))');

        tooltip
          .style('visibility', 'visible')
          .html(`
            <div style="font-weight: 600; margin-bottom: 4px; color: ${theme.palette.text.primary}">${data.data.label}</div>
            <div style="color: ${theme.palette.text.secondary}">Value: ${data.data.value}</div>
            <div style="color: ${theme.palette.text.secondary}">Percentage: ${percentage}%</div>
          `);

        const tooltipWidth = tooltipRef.current?.offsetWidth || 0;
        const tooltipHeight = tooltipRef.current?.offsetHeight || 0;
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        tooltip
          .style('left', `${mouseX - tooltipWidth/2}px`)
          .style('top', `${mouseY - tooltipHeight - 10}px`);
      })
      .on('mouseout', function(event: MouseEvent, d) {
        const data = d as d3.PieArcDatum<{ label: string; value: number }>;
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', () => arc(data))
          .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))');

        tooltip.style('visibility', 'hidden');
      });

    // Add center text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', theme.palette.text.secondary)
      .text('Total');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .style('fill', theme.palette.text.primary)
      .text(total);

  }, [data, width, height, margin, theme, colorPalette, colors]);

  return (
    <Box 
      sx={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ 
          maxWidth: '100%',
          height: 'auto',
          display: 'block'
        }}
      />
      <div ref={tooltipRef} />
    </Box>
  );
};

export default DoughnutChart; 