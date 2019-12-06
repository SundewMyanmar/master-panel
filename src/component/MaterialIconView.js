import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Icon, Grid, Divider, TextField, InputAdornment, IconButton } from '@material-ui/core';
import { primary } from '../config/Theme';
import { MATERIAL_ICONS } from '../config/MaterialIcon';

const styles = theme => ({
    rootContainer: {
        padding: theme.spacing.unit * 2,
    },
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit,
        paddingBottom: 0,
        borderRadius: 0,
    },
    divider: {
        backgroundColor: primary.contrastText,
        marginTop: 10,
    },
    title: {
        textAlign: "center",
        padding: 12,
        color: primary.main
    },
    buttonSpan: {
        cursor: 'pointer',
        padding: 8,
        margin: 2,
        width: 66,
        textAlign: 'center',
        border: '1px solid rgba(164, 180, 202, 0.08)',
        background: primary.contrastText
    },
    buttonCaption: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color: primary.main,
        fontSize: 11
    },
    searchInput: {
        width: "100%"
    }
});

class MaterialIconView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    clearSearch = () => {
        this.setState({ search: "" });
    }

    handleMouseDown = event => {
        event.preventDefault();
    };

    onChangeText = (value) => {
        this.setState({ search: value });
    }

    getFilter = (icons) => {
        var search = this.state.search;
        if (!search) return icons;
        else {
            return icons.filter(function (icon) {
                return icon.name.toLowerCase().search(
                    search.toLowerCase()
                ) !== -1;
            });
        }
    }

    renderIcon = (category) => {
        const { classes, onIconClick, _this } = this.props;
        const filter = this.getFilter(category.icons);

        return (
            filter.length > 0 ?
                <div className={classes.root} key={'dv' + category.key}>
                    <div className={classes.title}>
                        {category.name.toUpperCase()}
                        <Divider className={classes.divider} />
                    </div>
                    <Grid className={classes.grid} key={category.key} container item justify="center" xs={12} sm={12} md={12} lg={12}>
                        {
                            filter.map(icon => {
                                return (
                                    <span className={classes.buttonSpan} onClick={() => {
                                        if (onIconClick) {
                                            onIconClick(icon.ligature, _this);
                                        }
                                    }} key={icon.id} aria-label="Delete">
                                        <div>
                                            <Icon color="primary">{icon.ligature}</Icon>
                                        </div>
                                        <div className={classes.buttonCaption}>{icon.ligature}</div>
                                    </span>
                                )
                            })
                        }
                    </Grid>
                </div> : ''
        )
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.rootContainer}>
                <div className={classes.root}>
                    <div className={classes.title}>
                        <TextField
                            className={classes.searchInput}
                            id="input-with-icon-textfield"
                            label="Search Icons"
                            value={this.state.search}
                            onChange={(event) => this.onChangeText(event.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Icon color="primary">search</Icon>
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {
                                            this.state.search ?
                                                <IconButton
                                                    edge="end"
                                                    aria-label="toggle password visibility"
                                                    onClick={this.clearSearch}
                                                    onMouseDown={this.handleMouseDown}
                                                >
                                                    <Icon color="primary">close</Icon>
                                                </IconButton> : ""
                                        }
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                </div>
                {
                    MATERIAL_ICONS.categories.map(category => {
                        return this.renderIcon(category);
                    })
                }
            </div>
        );
    }
}

MaterialIconView.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MaterialIconView);