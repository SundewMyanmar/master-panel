import React from 'react';
import PropTypes from 'prop-types';
import { withStyles,Icon,Grid,Divider } from '@material-ui/core';
import {primary} from '../config/Theme';
import {MATERIAL_ICONS} from '../config/MaterialIcon';

const styles=theme=>({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        borderRadius: 0,
    },
    divider: {
        backgroundColor: primary.contrastText,
        marginTop: 10,
    },
    title:{
        textAlign: "center",
        padding:12,
        color:primary.main
    },
    buttonSpan:{
        cursor:'pointer',
        padding:8,
        margin:2,
        width:66,
        textAlign:'center',
        border:'1px solid rgba(164, 180, 202, 0.08)',
        background:primary.contrastText
    },
    buttonCaption:{
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        color:primary.main,
        fontSize:11
    }
});

class MaterialIconView extends React.Component{
    constructor(props){
        super(props);

        this.state={};
    }

    render(){
        const {classes, onIconClick,_this} = this.props;
        return(
            MATERIAL_ICONS.categories.map(category=>{
                return(
                    <div className={classes.root} key={'dv'+category.key}>
                        <div className={classes.title}>
                            {category.name.toUpperCase()}
                            <Divider className={classes.divider} />
                        </div>
                        <Grid className={classes.grid} key={category.key} container item justify="center" xs={12} sm={12} md={12} lg={12}>
                            {
                                category.icons.map(icon=>{
                                    return(
                                        <span className={classes.buttonSpan} onClick={()=>{
                                            if(onIconClick){
                                                onIconClick(icon.ligature,_this);
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
                    </div>
                )
            })
        );
    }
}

MaterialIconView.propTypes={
    classes:PropTypes.object.isRequired,
    theme:PropTypes.object.isRequired
};

export default withStyles(styles)(MaterialIconView);