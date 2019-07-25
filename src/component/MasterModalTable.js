import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@material-ui/core/Checkbox';
import TablePagination from '@material-ui/core/TablePagination';
import { Button, Typography } from '@material-ui/core';

const styles = theme => ({
    root: {
        width: '100%',
        borderRadius: 0,
        fontSize: '0.75rem',
        fontWeight: '400',
        lineHeight: '1.375em',
        fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    },
    table: {
        minWidth: 700,
    },
    toolbar:{
        display: 'flex',
        borderBottom: '0.5px solid #ccc',
        alignItems: 'center',
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
    tableWrapper:{
        overflowX: 'auto',
    },
    search:{
        width: 'calc(25%)',
        display: 'flex',
        marginLeft: '25px'
    },
    pagination:{
        overflow: 'hidden',
        display: 'flex',
    },
    button: {
        margin: '0px 10px',
        padding: '5px 5px',
    },
    title:{
        width: 'calc(50%)',
        fontSize: '1.5em',
        margin: '0 auto',
        textAlign: 'center',
    },
    buttonField:{
        display: 'flex',
        width: 'calc(25%)',
        justifyContent: 'flex-end'
    },
    pager: {
        flexShrink: 0,
    },
});

const StyledPager = withStyles(theme=>({
    root:{
        color:theme.palette.primary.main,
        flex:1,
        
    },
    selectRoot: {
      width:50,
    },
    selectIcon:{
        color:theme.palette.primary.main
    }
}))(TablePagination);

const CustomTableCell = withStyles(theme => ({
    head: {
        paddingLeft:0,
        paddingRight:5,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.background.default,
    },
    body: {
        paddingLeft:0,
        paddingRight:5,
        // color:theme.palette.primary.main
    },
}))(TableCell);

class MasterModalTable extends React.Component {

    constructor(props){
        super(props);
        
        // var fields=this.props.fields;
        // fields.push({
        //     name:"",
        //     align:"right",
        //     display_name:""
        // })

        this.state={
        }
    }

    TablePaginationActions=()=>{
        const { classes, theme, pageChange, total, pageSize, currentPage, _this} = this.props;
        
        return (<div className={[classes.pager]}>
            <IconButton onClick={()=>pageChange("first",_this)} aria-label="First Page">
                {theme.direction === 'rtl' ? <Icon style={{ color:this.props.theme.palette.primary.main, fontSize: 22 }}>last_page</Icon> : 
                    <Icon style={{ color:this.props.theme.palette.primary.main, fontSize: 22 }}>first_page</Icon>}
            </IconButton>
            <IconButton onClick={()=>pageChange("previous",_this)} aria-label="Previous Page">
                {theme.direction === 'rtl' ? <Icon style={{ color:this.props.theme.palette.primary.main, fontSize: 22 }}>chevron_right</Icon> : 
                <Icon style={{ color:this.props.theme.palette.primary.main, fontSize: 22 }}>chevron_left</Icon>}
            </IconButton>
            <IconButton onClick={()=>pageChange("forward",_this)} aria-label="Next Page">
                {theme.direction === 'rtl' ? <Icon style={{ color:this.props.theme.palette.primary.main, fontSize: 22 }}>chevron_left</Icon> : 
                <Icon style={{ color:this.props.theme.palette.primary.main, fontSize: 22 }}>chevron_right</Icon>}
            </IconButton>
            <IconButton onClick={()=>pageChange("last",_this)} aria-label="Last Page">
                {theme.direction === 'rtl' ? <Icon style={{ color:this.props.theme.palette.primary.main, fontSize: 22 }}>first_page</Icon> : 
                <Icon style={{ color:this.props.theme.palette.primary.main, fontSize: 22 }}>last_page</Icon>}
            </IconButton>
        </div>);
    }

    handleSortBy(sortBy){
        const {items}=this.props;
        var sortOrder=this.state.sortOrder;
        if(this.state.sortBy===sortBy){
            sortOrder=!this.state.sortOrder;
        }
        else{
            sortOrder=true;
        }

        const result =
            !sortOrder
                ? items.sort((a, b) => (b[sortBy] < a[sortBy] ? -1 : 1)) :
                items.sort((a, b) => (a[sortBy] < b[sortBy] ? -1 : 1));

        this.setState({
            sortBy:sortBy,
            sortOrder:sortOrder,
            items:result
        });
    }

    render() {
        const { classes, multi, items, fields, tableTitle, filterTextChange, onKeyDown, searchText, handleRowClick, onCloseDialog, total, pageSize, currentPage, handleChangePage, handleChangeRowsPerPage,_this  } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.toolbar}>
                    <div className={classes.search}>
                        <FormControl className={classes.FormControl}>
                            <Input
                                autoFocus={searchText ? false : true}
                                onKeyDown={onKeyDown}
                                onChange={(event) => filterTextChange(event.target.id, event.target.value)}
                                value={searchText}
                                placeholder="Search"
                                id="search"
                                type="text"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Icon>search</Icon>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </div>
                    <div className={classes.title}>
                        <span>{tableTitle}</span>
                    </div>
                    <div className={classes.buttonField}>
                        <Tooltip title="Close" placement="left">
                            <IconButton onClick={onCloseDialog} color="primary" className={classes.button} aria-label="Close">
                                <Icon>close</Icon>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
                <div className={classes.tableWrapper}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                {fields.map(field=>{
                                    return (
                                        <CustomTableCell key={field.display_name} align={field.align}>
                                            {field.name!==""?
                                            <Button size="small" style={{color:this.props.theme.palette.background.default}} onClick={()=>this.handleSortBy(field.name)}>
                                                <Icon style={{ color:this.props.theme.palette.background.default, fontSize: 22, display:this.state.sortBy===field.name?'block':'none' }}>{this.state.sortBy===field.name && this.state.sortOrder? 'arrow_drop_down':'arrow_drop_up'}</Icon>
                                                {field.display_name}
                                            </Button> 
                                            :  
                                            <Typography variant="subtitle2" style={{ color: this.props.theme.palette.background.default}}>{field.display_name}</Typography>}
                                        </CustomTableCell>        
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map(row => {
                                if(multi){
                                    const isSelected = this.props.isSelected(row.id);
                                    return(
                                        <TableRow hover
                                            className={classes.row}
                                            key={row.id}
                                            onClick={event => handleRowClick(event, row)}
                                            role="checkbox"
                                            aria-checked={isSelected}
                                            tabIndex={-1}
                                            selected={isSelected}
                                        >
                                        {fields.map(field=>{
                                            if(field.name!==""){
                                                if(field.type==="IMAGE"){
                                                    return(
                                                        <CustomTableCell key={field.name} align={field.align}>
                                                            {
                                                                row[field.name]?<img alt="" width={40} src={row[field.name].public_url}/>:''
                                                            }
                                                        </CustomTableCell>
                                                    );
                                                }else
                                                    return(
                                                        <CustomTableCell key={field.name} align={field.align}>{row[field.name]}</CustomTableCell>
                                                    );
                                            } else {
                                                return(
                                                    <CustomTableCell key="Action" align={field.align} padding="checkbox">
                                                        <Checkbox checked={isSelected} />
                                                    </CustomTableCell>
                                                )
                                            }
                                        })}
                                        </TableRow>
                                    )
                                } else {
                                    return(
                                        <TableRow hover
                                            className={classes.row}
                                            key={row.id}
                                            onClick={event => handleRowClick(event, row)}
                                            tabIndex={-1}
                                        >
                                        {fields.map(field=>{
                                            if(field.name!==""){
                                                if(field.type==="IMAGE"){
                                                    return(
                                                        <CustomTableCell key={field.name} align={field.align}>
                                                            {
                                                                row[field.name]?<img alt="" width={40} src={row[field.name].public_url}/>:''
                                                            }
                                                        </CustomTableCell>
                                                    );
                                                }else
                                                    return(
                                                        <CustomTableCell key={field.name} align={field.align}>{row[field.name]}</CustomTableCell>
                                                    );
                                            } else {
                                                return(
                                                    <CustomTableCell key="Action" align={field.align} padding="checkbox">
                                                    </CustomTableCell>
                                                )
                                            }
                                        })}
                                        </TableRow>
                                    )
                                }
                            })}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <StyledPager
                                    rowsPerPageOptions={[5, 10, 25]}
                                    colSpan={6}
                                    count={total}
                                    rowsPerPage={pageSize}
                                    labelRowsPerPage="Page Size :"
                                    page={currentPage}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={(event)=>{
                                        handleChangeRowsPerPage(event,_this)
                                    }}
                                    ActionsComponent={this.TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            </div>
        );
    }
}

MasterModalTable.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    items: PropTypes.array.isRequired,
    fields: PropTypes.array.isRequired
};

export default withRouter(withStyles(styles,{ withTheme: true })(MasterModalTable));