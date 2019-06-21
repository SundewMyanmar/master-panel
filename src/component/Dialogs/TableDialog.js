import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider'

import MasterTable from '../MasterModalTable';

const styles = theme => ({
});

class AlertDialog extends React.Component {

    render() {
        const { items, fields, multi, onOpenDialog, onCloseDialog, tableTitle, isSelected, handleRowClick, filterTextChange, onKeyDown, searchText, pageChange, total, pageSize, currentPage, handleChangePage, handleChangeRowsPerPage, _this  } = this.props;

        return (
            <Dialog aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="md"
                open={onOpenDialog}
            >
                <DialogContent style={{ padding: '0px'}}>
                    <MasterTable tableTitle={tableTitle}
                        total={total}
                        items={items}
                        fields={fields}
                        isSelected={isSelected}
                        onCloseDialog={onCloseDialog}
                        searchText={searchText}
                        onKeyDown={onKeyDown}
                        filterTextChange={filterTextChange}
                        handleRowClick={handleRowClick}
                        pageChange={pageChange}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                        _this={_this}
                        multi={multi}
                    />
                    <Divider light />
                    <DialogActions>
                        <Button onClick={onCloseDialog}>Cancel</Button>
                        <Button onClick={onCloseDialog}>Ok</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        );
    }
}

AlertDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) =>{
    return{
        lunchbox : state
    }
}

export default connect(mapStateToProps)(withStyles(styles)(AlertDialog));