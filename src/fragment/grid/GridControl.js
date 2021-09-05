import React from 'react';
import { Grid } from '@material-ui/core';

export interface GridControlProps {
    direction: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
    spacing: number;
    itemPerDirection: number;
    items: Array<Any>;
}

const GridControl = (props: GridControlProps) => {
    const { direction, justifyContent, alignItems, spacing, itemPerDirection, items } = props;

    let defaultWidth = null;
    if (itemPerDirection) {
        defaultWidth = Math.abs(12 / itemPerDirection);
    }

    return (
        <>
            <Grid container direction={direction} justifyContent={justifyContent} alignItems={alignItems} spacing={spacing}>
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
};

export default GridControl;
