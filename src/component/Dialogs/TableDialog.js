import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider'

import DialogTable from '../Tables/DialogTable';

const styles = theme => ({
});

class AlertDialog extends React.Component {

    render() {
        const { onOpenDialog, onCloseDialog, tableTitle, isSelected, getData, page, total, handleRowClick, rowsPerPage, onChangePage, changeRowsPerPage, filterTextChange, handleFilter, filterText } = this.props;

        return (
            <Dialog aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="md"
                open={onOpenDialog}
            >
                <DialogContent style={{ padding: '0px'}}>
                    <DialogTable tableTitle={tableTitle}
                        total={total}
                        data={getData}
                        isSelected={isSelected}
                        page={page}
                        rowsPerPage={rowsPerPage} 
                        onCloseDialog={onCloseDialog}
                        filterText={filterText}
                        handleFilter={handleFilter}
                        filterTextChange={filterTextChange}
                        changeRowsPerPage={changeRowsPerPage} 
                        onChangePage={onChangePage}
                        handleRowClick={handleRowClick}
                    />
                    <Divider light />
                    <DialogActions>
                        <Button onClick={onCloseDialog} color="primary">Ok</Button>
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
        million : state
    }
}

export default connect(mapStateToProps)(withStyles(styles)(AlertDialog));