import React, { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { useTheme, Box } from '@mui/material';

interface LineChartProps {
  data: { label: string; value: number }[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  colors?: string[];
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 500,
  height = 300,
  margin = { top: 20, right: 20, bottom: 60, left: 60 },
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
    const gradient = defs.append('linearGradient')
      .attr('id', 'line-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', colorPalette[0]);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', colorPalette[1]);

    // Create line generator
    const line = d3.line<{ label: string; value: number }>()
      .x(d => (x(d.label) || 0) + x.bandwidth() / 2)
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Add area gradient
    const area = d3.area<{ label: string; value: number }>()
      .x(d => (x(d.label) || 0) + x.bandwidth() / 2)
      .y0(height - margin.bottom)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Add area
    svg.append('path')
      .datum(data)
      .attr('fill', `url(#line-gradient)`)
      .attr('fill-opacity', 0.1)
      .attr('d', area);

    // Add line with animation
    const path = svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', `url(#line-gradient)`)
      .attr('stroke-width', 3)
      .attr('d', line);

    // Add dots
    const dots = svg.selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr('cy', d => y(d.value))
      .attr('r', 6)
      .attr('fill', theme.palette.background.paper)
      .attr('stroke', colorPalette[0])
      .attr('stroke-width', 3)
      .style('cursor', 'pointer')
      .style('filter', 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))');

    // Add hover effects and tooltips
    dots.on('mouseover', function(event: MouseEvent, d: { label: string; value: number }) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 8)
        .style('filter', 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))');

      const containerRect = containerRef.current?.getBoundingClientRect();
      const dotElement = this as SVGCircleElement;
      const dotRect = dotElement.getBoundingClientRect();
      
      if (!containerRect) return;

      tooltip
        .style('visibility', 'visible')
        .html(`
          <div style="font-weight: 600; margin-bottom: 4px; color: ${theme.palette.text.primary}">${d.label}</div>
          <div style="color: ${theme.palette.text.secondary}">Value: ${d.value}</div>
        `);

      const tooltipWidth = tooltipRef.current?.offsetWidth || 0;
      const tooltipHeight = tooltipRef.current?.offsetHeight || 0;
      
      const tooltipLeft = dotRect.left - containerRect.left - (tooltipWidth / 2) + (dotRect.width / 2);
      const tooltipTop = dotRect.top - containerRect.top - tooltipHeight - 12;

      tooltip
        .style('left', `${tooltipLeft}px`)
        .style('top', `${tooltipTop}px`);
    })
    .on('mouseout', function() {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('r', 6)
        .style('filter', 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))');

      tooltip.style('visibility', 'hidden');
    });

    // Add axes with styled appearance
    const xAxis = svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .style('font-size', '12px');

    xAxis.selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('fill', theme.palette.text.secondary)
      .style('font-weight', '500');

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

    // Animate line on initial render
    const pathLength = path.node()?.getTotalLength() || 0;
    path
      .attr('stroke-dasharray', pathLength)
      .attr('stroke-dashoffset', pathLength)
      .transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attr('stroke-dashoffset', 0);

  }, [data, width, height, margin, theme, colorPalette]);

  return (
    <Box ref={containerRef} sx={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ maxWidth: '100%' }}
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

export default LineChart; 