import React, { useState } from 'react';
import { withTheme } from '@material-ui/core';
import { PieChart, Pie, Sector, Cell, Legend, ResponsiveContainer } from 'recharts';

export type SDPieChartProps = {
    data: Array<Object>,
    type: 'pie' | 'donut',
    title: String,
    width: Any,
    height: Any,
    innerRadius: number,
    outerRadius: number,
    cx: number,
    cy: number,
    legendIcon: 'plainline' | 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye' | 'plainline',
};

const SDPieChart = (props: SDPieChartProps) => {
    const { data, type, title, width, height, innerRadius, outerRadius, cx, cy, legendIcon } = props;
    const { theme } = props;
    const [activeIndex, setActiveIndex] = useState(0);

    const renderActiveShape = props => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

        const testradius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const testx = cx + testradius * Math.cos(-midAngle * RADIAN);
        const testy = cy + testradius * Math.sin(-midAngle * RADIAN);

        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';
        console.log('pie', testx, testy, cx, cy);
        const pieType =
            type == 'donut' ? (
                <text x={cx} y={cy} dy={8} textAnchor="middle" fill={theme.palette.text.primary}>
                    {payload.name}
                </text>
            ) : null;
        return (
            <g>
                <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 6}
                    outerRadius={outerRadius + 10}
                    fill={theme.palette.text.primary}
                />
                <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={theme.palette.text.primary} fill="none" />
                <circle cx={ex} cy={ey} r={2} fill={theme.palette.text.primary} stroke="none" />
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={theme.palette.text.primary}>{`${payload.name}`}</text>
                <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill={theme.palette.text.primary}>
                    {`${value} (${(percent * 100).toFixed(0)}%)`}
                </text>
                {pieType}
            </g>
        );
    };

    let pieType =
        type == 'donut'
            ? {
                  innerRadius: innerRadius || 60,
                  outerRadius: outerRadius || 90,
              }
            : null;

    return (
        <div>
            <ResponsiveContainer width={width || '100%'} height={height || 300}>
                <PieChart>
                    <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={data}
                        cx={cx || 190}
                        cy={cy || 110}
                        {...pieType}
                        onMouseEnter={(data, index) => setActiveIndex(index)}
                    >
                        {data.map(d => {
                            return <Cell key={`c-${d.name}`} fill={d.color} />;
                        })}
                    </Pie>
                    <Legend iconType={legendIcon || 'rect'} align="right" verticalAlign="top" height={36} />
                </PieChart>
            </ResponsiveContainer>
            <div style={{ fontWeight: 'bold', fontSize: 14, textAlign: 'center', marginBottom: theme.spacing(1) }}>{title || 'Donut Chart'}</div>
        </div>
    );
};

export default withTheme(SDPieChart);
