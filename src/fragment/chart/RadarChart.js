import * as React from 'react';
import { withTheme } from '@material-ui/core';
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { DataKeyProps } from './AreaChart';

export type SDRadarChartProps = {
    data: Array<Object>,
    title: String,
    width: Object,
    height: Object,
    aKey: String,
    dataKeys: Array<DataKeyProps>,
    maxDomain: number,
    legendIcon: 'plainline' | 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye' | 'plainline',
};

const SDRadarChart = (props: SDRadarChartProps) => {
    const { data, title, width, height, dataKeys, aKey, maxDomain, legendIcon } = props;
    const { theme } = props;

    const estimateLen = ((width || 0) + (height || 0)) / 2;
    let domain = null;
    if (maxDomain) {
        domain = {
            domain: [0, maxDomain],
        };
    }

    return (
        <div>
            <ResponsiveContainer width={width || 280} height={height || 260}>
                <RadarChart
                    cx={estimateLen == 0 ? 168 : (estimateLen * 300) / 500}
                    cy={estimateLen == 0 ? 140 : estimateLen / 2}
                    outerRadius={estimateLen == 0 ? 84 : (estimateLen * 150) / 500}
                    data={data}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                    <Legend iconType={legendIcon || 'rect'} align="right" verticalAlign="top" height={36} />
                    <PolarGrid />
                    <PolarAngleAxis dataKey={aKey} tick={{ fill: theme.palette.text.primary }} />
                    <PolarRadiusAxis {...domain} />
                    {dataKeys.map(key => {
                        return <Radar key={`rk-${key.key}`} name={key.key} dataKey={key.key} stroke={key.color} fill={key.color} fillOpacity={0.3} />;
                    })}
                </RadarChart>
            </ResponsiveContainer>
            <div style={{ fontWeight: 'bold', fontSize: 14, textAlign: 'center', marginBottom: theme.spacing(1) }}>{title || 'Radar Chart'}</div>
        </div>
    );
};

export default withTheme(SDRadarChart);
