import * as React from 'react';
import { withTheme } from '@material-ui/core';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataKeyProps } from './AreaChart';

export type SDBarChartProps = {
    data: Array<Object>,
    width: Object,
    height: Object,
    title: String,
    xKey: String,
    yKey: String,
    dataKeys: Array<DataKeyProps>,
    legendIcon: 'plainline' | 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye' | 'plainline',
    layout: 'horizontal' | 'vertical',
    mode: 'default' | 'minimal',
};

const SDBarChart = props => {
    const { mode, data, width, height, title, xKey, yKey, dataKeys, legendIcon, layout } = props;
    const { theme } = props;

    let chartMargin = { top: 10, right: 20, left: 0, bottom: 20 };

    let xDataKey = null;
    if (xKey) {
        xDataKey = { dataKey: xKey };
    }

    let yDataKey = null;
    if (yKey) {
        yDataKey = { dataKey: yKey };
    }

    let xProps = {
        tick: { fill: theme.palette.text.primary },
        label: {
            value: title || 'Area Chart',
            fontSize: 14,
            fontWeight: 'bold',
            fill: theme.palette.text.primary,
            position: 'insideBottom',
            offset: -10,
        },
    };
    let yProps = {
        tick: { fill: theme.palette.text.primary },
    };

    let xA = <XAxis {...xDataKey} {...xProps}></XAxis>;
    let yA = <YAxis {...yDataKey} {...yProps} />;

    if (layout == 'vertical') {
        xA = <XAxis type="number" {...yDataKey} {...yProps} />;
        yA = <YAxis {...xDataKey} {...xProps} type="category"></YAxis>;
    }
    return (
        <ResponsiveContainer width={width || '80%'} height={height || 280}>
            {mode == 'minimal' ? (
                <BarChart data={data}>
                    {dataKeys.map(key => {
                        return <Bar key={`bc-${key.key}`} dataKey={key.key} fill={key.color} />;
                    })}
                </BarChart>
            ) : (
                <BarChart layout={layout || 'horizontal'} data={data} margin={chartMargin}>
                    {xA}
                    {yA}
                    <CartesianGrid />
                    <Tooltip
                        cursor={{ fill: theme.palette.background.default, opacity: 0.7 }}
                        contentStyle={{ backgroundColor: theme.palette.background.default, opacity: 0.7 }}
                        labelStyle={{ color: theme.palette.text.primary }}
                        itemStyle={{ color: theme.palette.text.primary }}
                        formatter={function(value) {
                            return `${value}`;
                        }}
                        labelFormatter={function(value) {
                            return `${value}`;
                        }}
                    />
                    <Legend iconType={legendIcon || 'rect'} align="right" verticalAlign="top" height={36} />
                    {dataKeys.map(key => {
                        return <Bar key={`bc-${key.key}`} dataKey={key.key} fill={key.color} />;
                    })}
                </BarChart>
            )}
        </ResponsiveContainer>
    );
};

export default withTheme(SDBarChart);
