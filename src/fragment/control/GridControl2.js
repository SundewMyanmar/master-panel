import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import FormatManager from '../../util/FormatManager';

const useStyles = makeStyles((theme) => ({
    root: { flexGrow: 1 },
}));

/**
 * ISSUES...
 * TODO: odd number column not work well (can use 12 column span instead)
 * rowspan>1 can't be in the middle
 * {
 *      row: 1,
 *      rowspan: 2,
 *      colspan: 2,
 *      content: <div>{faker.hacker.noun()}</div>,
 *  }
 */

const GridControl2 = (props) => {
    const { items, columns } = props;
    const [rData] = useState(() => {
        let data = {};
        for (let i = 0; i < items.length; i++) {
            if (!data[`r${items[i].row}`] || data[`r${items[i].row}`] < items[i].rowspan) {
                data[`r${items[i].row}`] = items[i].rowspan;
            }
        }
        console.log('rdata', data);
        return data;
    });

    const calResponsive = (span) => {
        return {
            xl: span,
            lg: span,
            md: span,
            sm: span <= 8 ? 12 : span,
            xs: 12,
        };
    };

    const renderColumn = (item, idx, xs) => {
        let xsProps = {};
        if (!xs) {
            xsProps = calResponsive(Math.ceil((item.colspan * 12) / columns));
        }

        return (
            <Grid container {...xsProps} item style={{ width: '100%', backgroundColor: FormatManager.randomColor() }}>
                <div style={{ height: 100 }}>
                    {`${idx + 1} : `}
                    {item.content}
                </div>
            </Grid>
        );
    };

    const renderRowSpan = (i, rspan, rlen, span) => {
        let rowResult = [];
        while (i + 1 < items.length && rspan < rlen) {
            i += 1;
            rspan += items[i].rowspan;
            span = Math.ceil((items[i].colspan * 12) / columns);
            rowResult.push(renderColumn(items[i], i, true));
        }
        return {
            content: rowResult,
            span: span,
            i: i,
        };
    };

    const renderSpan = (idx) => {
        let i = idx;
        let rlen = items[idx].rowspan;
        let clen = items[idx].colspan;
        let result = [];
        let rspan = 0;

        // let xxlen = 1;
        // if (rData[`r${items[idx].row}`] == 1) {
        result.push(renderColumn(items[i], i));
        //     xxlen = 0;
        // }

        let cspan = clen;

        while (i + 1 < items.length && cspan <= 12) {
            let span = 1;
            let rowResult = null;

            rowResult = renderRowSpan(i, rspan, rlen, span);
            if (rowResult) {
                span = rowResult.span;
                i = rowResult.i;

                let responsive = calResponsive(span);
                result.push(
                    <Grid container item direction="column" {...responsive} style={{ backgroundColor: 'red' }}>
                        {rowResult.content}
                    </Grid>,
                );
            }
            cspan += span;
        }

        return {
            idx: i,
            content: result,
        };
    };

    const renderGrid = () => {
        let result = [];

        for (var i = 0; i < items.length; i++) {
            let item = items[i];
            if (rData[`r${item.row}`] == 1) {
                result.push(renderColumn(item, i));
            } else {
                let resultSpan = renderSpan(i);
                i = resultSpan.idx;
                result.push(resultSpan.content);
            }
        }
        return result;
    };

    return (
        <>
            <Grid container direction="row" style={{ width: '100%' }}>
                {renderGrid()}
            </Grid>
        </>
    );
};

export default GridControl2;
