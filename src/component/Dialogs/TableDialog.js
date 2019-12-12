import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import MasterTable from '../MasterModalTable';

import { Button, Dialog, DialogActions, DialogContent, Divider } from '@material-ui/core';

const styles = theme => ({});

class TableDialog extends React.Component {
    render() {
        const {
            items,
            fields,
            multi,
            onOpenDialog,
            onCloseDialog,
            tableTitle,
            isSelected,
            handleRowClick,
            filterTextChange,
            onKeyDown,
            searchText,
            pageChange,
            total,
            pageSize,
            currentPage,
            handleChangePage,
            handleChangeRowsPerPage,
            _this,
        } = this.props;

        return (
            <Dialog aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" fullWidth maxWidth="md" open={onOpenDialog}>
                <DialogContent style={{ padding: '0px' }}>
                    <MasterTable
                        tableTitle={tableTitle}
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

TableDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        masterpanel: state,
    };
};

export default connect(mapStateToProps)(withStyles(styles)(TableDialog));
