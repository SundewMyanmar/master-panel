import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Icon, AppBar, Tabs, Tab, Box } from '@material-ui/core';
import { common } from '../../config/Theme';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        padding: 8,
    },
    tabTitle: {
        minWidth: 50,
        textTransform: 'none',
        flex: 1,
    },
    tabPanel: {
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.background.default}`,
    },
}));

export type TabPanelProps = {
    children: Any,
    value: number,
    index: number,
};

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

const a11yProps = index => {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
};

export type TabControlProps = {
    tabs: Object,
    orientation: 'horizontal' | 'vertical',
    indicatorColor: 'secondary' | 'primary',
    textColor: 'secondary' | 'primary' | 'inherit',
    variant: 'standard' | 'scrollable' | 'fullWidth',
    scrollButtons: 'auto' | 'desktop' | 'on' | 'off',
    onChange: (e, newValue) => void,
};

const TabControl = (props: TabScrollButtonProps) => {
    const { tabs, onChange, orientation, textColor, indicatorColor, variant, scrollButtons } = props;
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (onChange) onChange(event, newValue);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant={variant || 'scrollable'}
                    scrollButtons={scrollButtons || 'on'}
                    indicatorColor={indicatorColor || 'primary'}
                    textColor={textColor || 'primary'}
                    orientation={orientation || 'horizontal'}
                    aria-label="scrollable force tabs example"
                >
                    {tabs &&
                        tabs.map((tab, index) => (
                            <Tab
                                key={`tab-header-${tabs.indexOf(tab)}`}
                                label={tab.label}
                                className={classes.tabTitle}
                                style={{ borderRight: index == tabs.length - 1 ? 'none' : `1px solid ${common.gray}` }}
                                icon={<Icon>{tab.icon}</Icon>}
                                {...a11yProps(tabs.indexOf(tab))}
                                wrapped
                            />
                        ))}
                </Tabs>
            </AppBar>
            {tabs &&
                tabs.map(tab => (
                    <TabPanel className={classes.tabPanel} key={`tab-content-${tabs.indexOf(tab)}`} value={value} index={tabs.indexOf(tab)}>
                        {tab.content}
                    </TabPanel>
                ))}
        </div>
    );
};

export default TabControl;
