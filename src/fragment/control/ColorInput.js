/* @flow */
import React from 'react';
import { SwatchesPicker, SketchPicker } from 'react-color';
import { makeStyles, ButtonGroup, Button, Icon, Paper, MenuItem, MenuList, Grow, ClickAwayListener, Popper, Grid } from '@material-ui/core';

const styles = makeStyles(theme => ({
    chooseButton: { textTransform: 'none' },
    menuContainer: { background: theme.palette.primary.main, color: theme.palette.primary.contrastText },
    buttonGroup: { marginTop: 4 },
}));

const DEFAULT_WIDTH = 320;
const DEFAULT_WIDTH2 = 300;
const DEFAULT_HEIGHT = 377;

type ColorInputProps = {
    defaultType: 'swatch' | 'sketch',
    defaultColor: string,
    onChangeComplete: (color: string) => void,
    onChange: (color: string) => void,
};

const ColorInput = (props: ColorInputProps) => {
    const options = [
        { name: 'Swatch Picker', type: 'swatch' },
        { name: 'Sketch Picker', type: 'sketch' },
    ];

    const classes = styles();
    const { defaultType, defaultColor, onChangeComplete, onChange } = props;
    const [color, setColor] = React.useState('#fff');
    const [inputType, setInputType] = React.useState('');

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(defaultType === 'sketch' ? 1 : 0);

    React.useEffect(() => {
        if (defaultColor) setColor(defaultColor);
        if (defaultType) setInputType(defaultType);
    }, []);

    const handleChangeComplete = newColor => {
        setColor(newColor);

        if (onChangeComplete) onChangeComplete(newColor.hex);
    };

    const handleChange = newColor => {
        setColor(newColor);

        if (onChange) onChange(newColor.hex);
    };

    const handleClick = () => {};

    const handleMenuItemClick = (event, index, type) => {
        setSelectedIndex(index);
        setOpen(false);
        setInputType(type);
    };

    const handleToggle = () => {
        setOpen(prevOpen => !prevOpen);
    };

    const handleClose = event => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const renderColorPicker = () => {
        return inputType === 'sketch' ? (
            <SketchPicker width={DEFAULT_WIDTH2} color={color} onChangeComplete={handleChangeComplete} />
        ) : (
            <SwatchesPicker width={DEFAULT_WIDTH} height={DEFAULT_HEIGHT} onChange={handleChange} />
        );
    };

    return (
        <div style={{ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT }}>
            <>{renderColorPicker()}</>
            <Grid container direction="column" alignItems="center">
                <Grid item xs={12}>
                    <ButtonGroup className={classes.buttonGroup} variant="contained" color="primary" ref={anchorRef} aria-label="split button">
                        <Button className={classes.chooseButton} onClick={handleClick}>
                            {options[selectedIndex] && options[selectedIndex].name}
                        </Button>
                        <Button
                            color="primary"
                            size="small"
                            aria-controls={open ? 'split-button-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-label="select merge strategy"
                            aria-haspopup="menu"
                            onClick={handleToggle}
                        >
                            <Icon>arrow_drop_down</Icon>
                        </Button>
                    </ButtonGroup>
                    <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                                }}
                            >
                                <Paper className={classes.menuContainer}>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList id="split-button-menu">
                                            {options.map((option, index) => (
                                                <MenuItem
                                                    key={option.name}
                                                    disabled={index === 2}
                                                    selected={index === selectedIndex}
                                                    onClick={event => handleMenuItemClick(event, index, option.type)}
                                                >
                                                    {option.name}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Grid>
            </Grid>
        </div>
    );
};

ColorInput.defaultProps = {
    defaultType: 'swatch',
    defaultColor: '#fff',
};

export default ColorInput;
