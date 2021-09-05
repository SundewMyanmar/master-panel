import * as React from 'react';
import { withTheme } from '@material-ui/core';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataKeyProps } from './AreaChart';

export interface SDLineChartProps {
    mode: 'default' | 'minimal';
    data: Array<Object>;
    width: object;
    height: object;
    title: string;
    xKey: string;
    yKey: string;
    dataKeys: Array<DataKeyProps>;
    legendIcon: 'plainline' | 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye' | 'plainline';
}

const SDLineChart = (props: SDLineChartProps) => {
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
                <LineChart
                    data={data}
                    margin={{
                        top: 0,
                        right: 0,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    {dataKeys.map((key) => {
                        return <Line key={`ak-${key.key}`} type="linear" dataKey={key.key} stroke={key.color} />;
                    })}
                </LineChart>
            ) : (
                <LineChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 20,
                    }}
                >
                    <CartesianGrid />
                    <XAxis
                        {...xDataKey}
                        tick={{ fill: theme.palette.text.primary }}
                        label={{
                            value: title || 'Line Chart',
                            fontSize: 14,
                            fontWeight: 'bold',
                            fill: theme.palette.text.primary,
                            position: 'insideBottom',
                            offset: -10,
                        }}
                    ></XAxis>
                    <YAxis {...yDataKey} tick={{ fill: theme.palette.text.primary }} />
                    <Tooltip
                        cursor={{ stroke: theme.palette.background.default, strokeWidth: 2 }}
                        contentStyle={{ backgroundColor: theme.palette.background.default, opacity: 0.7 }}
                        labelStyle={{ color: theme.palette.text.primary }}
                        itemStyle={{ color: theme.palette.text.primary }}
                        formatter={function (value) {
                            return `${value}`;
                        }}
                        labelFormatter={function (value) {
                            return `${value}`;
                        }}
                    />
                    <Legend iconType={legendIcon || 'rect'} align="right" verticalAlign="top" height={36} />
                    {dataKeys.map((key) => {
                        return <Line key={`ak-${key.key}`} type="linear" dataKey={key.key} stroke={key.color} />;
                    })}
                </LineChart>
            )}
        </ResponsiveContainer>
    );
};

export default withTheme(SDLineChart);
