import * as React from 'react';
import { withTheme } from '@material-ui/core';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export type DataKeyProps = {
    key: String,
    color: String,
};

export type SDAreaChartProps = {
    mode: 'default' | 'minimal',
    data: Array<Object>,
    width: Object,
    height: Object,
    title: String,
    xKey: String,
    yKey: String,
    dataKeys: Array<DataKeyProps>,
    legendIcon: 'plainline' | 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye' | 'plainline',
};

const SDAreaChart = (props: SDAreaChartProps) => {
    const { mode, data, width, height, title, xKey, yKey, dataKeys, legendIcon } = props;
    const { theme } = props;

    let xDataKey = null;
    if (xKey) {
        xDataKey = { dataKey: xKey };
    }

    let yDataKey = null;
    if (yKey) {
        yDataKey = { dataKey: yKey };
    }

    return (
        <ResponsiveContainer width={width || '80%'} height={height || 280}>
            {mode == 'minimal' ? (
                <AreaChart
                    data={data}
                    margin={{
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    {dataKeys.map(key => {
                        return <Area key={`ak-${key.key}`} type="monotone" dataKey={key.key} stroke={key.color} fillOpacity={1} fill={key.color} />;
                    })}
                </AreaChart>
            ) : (
                <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                    <defs>
                        {dataKeys.map(key => {
                            return (
                                <linearGradient key={`k-${key.key}`} id={key.key} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={key.color} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={key.color} stopOpacity={0.6} />
                                </linearGradient>
                            );
                        })}
                    </defs>
                    <XAxis
                        {...xDataKey}
                        tick={{ fill: theme.palette.text.primary }}
                        label={{
                            value: title || 'Area Chart',
                            fontSize: 14,
                            fontWeight: 'bold',
                            fill: theme.palette.text.primary,
                            position: 'insideBottom',
                            offset: -10,
                        }}
                    ></XAxis>
                    <YAxis {...yDataKey} tick={{ fill: theme.palette.text.primary }} />
                    <CartesianGrid />
                    <Tooltip
                        cursor={{ stroke: theme.palette.background.default, strokeWidth: 2 }}
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
                        return (
                            <Area
                                key={`ak-${key.key}`}
                                type="linear"
                                dataKey={key.key}
                                stroke={key.color}
                                fillOpacity={1}
                                fill={`url(#${key.key})`}
                            />
                        );
                    })}
                </AreaChart>
            )}
        </ResponsiveContainer>
    );
};

export default withTheme(SDAreaChart);
