import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Icon, AppBar, Tabs, Tab, Box } from '@material-ui/core';
import { common } from '../../config/Theme';
import type { HTMLProps } from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        marginBottom: theme.spacing(1),
    },
    tabControl: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    tabTitle: {
        minWidth: 120,
        minHeight: 48,
        flex: 'none',
        textTransform: 'none',
        color: theme.palette.text.primary,
    },
    tabPanel: {
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
}));

export interface TabPanelProps extends HTMLProps {
    children: Any;
    value: number;
    index: number;
}

export const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={4}>
                    <>{children}</>
                </Box>
            )}
        </div>
    );
};

const allyProps = (index) => {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
};

export interface TabControlProps extends HTMLProps {
    tabs: object;
    orientation: 'horizontal' | 'vertical';
    indicatorColor: 'secondary' | 'primary';
    // textColor: 'secondary' | 'primary' | 'inherit',
    variant: 'standard' | 'scrollable' | 'fullWidth';
    scrollButtons: 'auto' | 'desktop' | 'on' | 'off';
    onChange: (e, newValue) => void;
}

const TabControl = (props: TabControlProps) => {
    const { tabs, onChange, orientation, /*textColor,*/ indicatorColor, variant, scrollButtons, ...rest } = props;
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);

        if (onChange) onChange(event, newValue);
    };

    return (
        <div className={classes.root} {...rest}>
            <Tabs
                className={classes.tabControl}
                value={value}
                onChange={handleChange}
                aria-label="sundew-tab-control"
                variant={variant || 'scrollable'}
                scrollButtons={scrollButtons || 'auto'}
                indicatorColor={indicatorColor || 'secondary'}
                // textColor={textColor || 'primary'}
                TabIndicatorProps={{
                    style: {
                        height: 4,
                    },
                }}
                orientation={orientation || 'horizontal'}
            >
                {tabs &&
                    tabs.map((tab, index) => (
                        <Tab
                            key={`tab-header-${tabs.indexOf(tab)}`}
                            label={tab.label}
                            className={classes.tabTitle}
                            icon={<Icon>{tab.icon}</Icon>}
                            {...allyProps(tabs.indexOf(tab))}
                            wrapped
                        />
                    ))}
            </Tabs>
            {/* </AppBar> */}
            {tabs &&
                tabs.map((tab) => (
                    <TabPanel className={classes.tabPanel} key={`tab-content-${tabs.indexOf(tab)}`} value={value} index={tabs.indexOf(tab)}>
                        {tab.content}
                    </TabPanel>
                ))}
        </div>
    );
};

export default TabControl;
