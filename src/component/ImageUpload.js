import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router";
import { connect } from 'react-redux';
import { Icon, Input, IconButton } from '@material-ui/core';

import MenuListDialog from './Dialogs/MenuListDialog';

const styles = theme => ({
    container: {
        marginTop: 20,
        backgroundColor: '#f0f0f0',
        cursor: 'pointer',
    },
    image_button: {
        float: 'right',
        marginLeft: '-50%',
        marginTop: -12,
        marginRight: -12,
        //position: '-webkit-sticky', /* Safari */
        //position: 'sticky',
        //transform: 'translate(-50%, -50%)',
        backgroundColor: '#dd2c00',
        color: 'white',
        padding: 0,
        width: 25,
        height: 25,
        fontSize: 12,
        border: 'none',
        cursor: 'pointer',
        borderRadius: 40,
    }
});

class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewImage: {},
            showDialog: false,
        }
    }

    componentDidMount() {

    }

    onImageClick(id) {
        this.setState({ showDialog: true, id: id });
        // var upload=document.getElementById(id);
        // upload.click();
    }

    onImageChange(callback, _this, id) {
        var files = document.getElementById(id).files;
        if (files && files.length > 0) {
            this.setState({
                image: files[0]
            })

            this.processImage(files[0], this);

            if (callback) {
                callback(files[0], _this);
            }
        }
    }

    processImage(file, _this) {
        var fr = new FileReader();
        fr.onload = function () {
            _this.setState({
                previewImage: fr.result
            })
        }
        fr.readAsDataURL(file);
    }

    onRemove(_this) {
        _this.setState({
            image: null
        })
    }

    handleMenuListDialog = () => {
        this.setState({ showDialog: !this.state.showDialog })
    }

    uploadNew = () => {
        this.setState({ showDialog: false })
        var upload = document.getElementById(this.state.id);
        upload.click();
    }

    render() {
        const { classes, onImageChange, previewImage, onImageRemove, _this, disableUpload, args, disableRemove, id, handleFileOpen } = this.props;
        var { width, height } = this.props;

        var img, visibility;
        if (previewImage) {
            img = previewImage;
            if (disableRemove)
                visibility = "hidden";
            else
                visibility = true;
        } else {
            if (disableRemove)
                visibility = "hidden";
            else
                visibility = this.state.image ? "visible" : "hidden";
            img = this.state.image ? this.state.previewImage : "/res/upload.png";
        }

        if (!width)
            width = 200;
        if (!height)
            height = 200;
        return (
            <div>
                <MenuListDialog show={this.state.showDialog}
                    handleMenuListDialog={this.handleMenuListDialog}
                    uploadNew={this.uploadNew}
                    openFile={() => {
                        if (handleFileOpen) {
                            handleFileOpen(this)
                        }
                    }}
                />
                <div className={[classes.container]} style={{ width: width, height: height }}>
                    <img onClick={() => {
                        if (!disableUpload)
                            this.onImageClick(id)
                    }} src={img} alt="" style={{ width: "100%", height: "100%", borderRadius: 6, }} />
                    <IconButton style={{ visibility: visibility }} onClick={() => {
                        this.onRemove(this);
                        if (onImageRemove)
                            onImageRemove(_this, args);
                    }} className={classes.image_button}>
                        <Icon>close</Icon>
                    </IconButton>
                    {/* <Input style={{display:'none'}} id="imageUpload" type="file" value={this.state.uploadFile} onChange={(event)=>{
                        this.onImageChange(onImageChange,_this);
                    }}/> */}
                    <Input style={{ display: 'none' }} id={id} type="file" value={this.state.uploadFile} onChange={(event) => {
                        this.onImageChange(onImageChange, _this, id);
                    }} />
                </div>
            </div>
        )
    }
}

ImageUpload.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
    return {
        masterpanel: state
    }
}

export default withRouter(connect(mapStateToProps)(withStyles(styles, { withTheme: true })(ImageUpload)));