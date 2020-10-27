import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: { flexGrow: 1 },
}));

export type GridControlProps = {
    direction: 'row' | 'row-reverse' | 'column' | 'column-reverse',
    justify: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly',
    alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline',
    spacing: number,
    itemPerDirection: number,
    items: Array<Any>,
};

const GridControl = (props: GridControlProps) => {
    const { direction, justify, alignItems, spacing, itemPerDirection, items } = props;

    let defaultWidth = null;
    if (itemPerDirection) {
        defaultWidth = Math.abs(12 / itemPerDirection);
    }

    return (
        <>
            <Grid container direction={direction} justify={justify} alignItems={alignItems} spacing={spacing}>
                {items
                    ? items.map((i, index) => {
                          let xs = defaultWidth;
                          if (!xs) {
                              xs = i.xs || 12;
                          }
                          console.log('xs', xs);
                          return (
                              <Grid key={`gri-${index}`} item xs={xs}>
                                  {i.content}
                              </Grid>
                          );
                      })
                    : null}
            </Grid>
        </>
    );
};

GridControl.defaultProps = {
    direction: 'row',
    justify: 'flex-start',
    alignItems: 'flex-start',
};

export default GridControl;
