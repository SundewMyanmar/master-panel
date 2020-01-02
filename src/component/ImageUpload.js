import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Icon, Input, IconButton } from '@material-ui/core';

import MenuListDialog from './Dialogs/MenuListDialog';
import FileDialog from './Dialogs/FileDialog';

const styles = theme => ({
    container: {
        marginTop: 25,
        cursor: 'pointer',
        position: 'relative',
    },
    image_button: {
        position: 'absolute',
        top: -12,
        right: -12,
        backgroundColor: theme.palette.common.red,
        color: 'white',
        padding: 0,
        width: 25,
        height: 25,
        fontSize: 12,
        border: 'none',
        cursor: 'pointer',
        borderRadius: 40,
    },
});

const MENU_LIST_ITEMS = [
    {
        name: 'gallery',
        icon: 'photo',
        label: 'Choose From Gallery',
    },
    {
        name: 'upload',
        icon: 'cloud_upload',
        label: 'Upload New Image',
    },
];

class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewImage: null,
            showMenu: false,
            showFile: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.source !== this.props.source) {
            this.handleFileClick(this.props.source);
        }
    }

    handleImageClick = id => {
        this.setState({ showMenu: true, id: id });
    };

    handleImageChange = id => {
        var files = document.getElementById(id).files;
        if (files && files.length > 0) {
            this.setState({
                image: files[0],
            });

            this.processImage(files[0]);

            this.props.onImageChange(files[0]);
        }
    };

    processImage = file => {
        var fr = new FileReader();
        const _this = this;
        fr.onload = () => {
            _this.setState({
                previewImage: fr.result,
            });
        };
        fr.readAsDataURL(file);
    };

    onRemove = () => {
        this.props.onImageChange(null);
        this.setState({ previewImage: null });
    };

    handleFileClick = data => {
        let newState = { showFile: false };
        if (data && data.public_url) {
            newState.previewImage = data.public_url;
            this.props.onImageChange(data);
        }
        this.setState(newState);
    };

    handleFileClose = () => {
        this.setState({ showFile: false });
    };

    handleMenuItem = item => {
        console.log('Clicked Menu => ', item);
        if (item.name === 'gallery') {
            this.setState({ showMenu: !this.state.showMenu, showFile: true });
        } else if (item.name === 'upload') {
            this.setState({ showMenu: false });
            var upload = document.getElementById(this.state.id);
            upload.click();
        }
    };

    render() {
        const { classes, width, height, disableUpload, disableRemove, id, onError } = this.props;

        const visibility = !disableRemove && this.state.previewImage ? 'visible' : 'hidden';
        const img = this.state.previewImage ? this.state.previewImage : '/res/upload.png';

        return (
            <React.Fragment>
                <FileDialog showDialog={this.state.showFile} onError={onError} onClose={this.handleFileClose} onFileClick={this.handleFileClick} />
                <MenuListDialog showDialog={this.state.showMenu} title="Image Upload" items={MENU_LIST_ITEMS} onItemClick={this.handleMenuItem} />
                <div className={[classes.container]}>
                    <IconButton style={{ visibility: visibility }} onClick={this.onRemove} className={classes.image_button}>
                        <Icon>close</Icon>
                    </IconButton>
                    <img
                        onClick={() => {
                            if (!disableUpload) this.handleImageClick(id);
                        }}
                        src={img}
                        alt="Uploaded"
                        style={{
                            maxWidth: width,
                            maxHeight: height,
                            width: 'auto',
                            height: 'auto',
                        }}
                    />
                    <Input
                        style={{ display: 'none' }}
                        id={id}
                        type="file"
                        value={this.state.uploadFile}
                        onChange={() => this.handleImageChange(id)}
                    />
                </div>
            </React.Fragment>
        );
    }
}

ImageUpload.defaultProps = {
    id: 'ImageUpload',
    width: 200,
    height: 200,
    disableUpload: false,
    disableRemove: false,
    onImageChange: image => console.log('Changed Image => ', image),
    onError: error => console.log('Error => ', error),
};

ImageUpload.propTypes = {
    id: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    source: PropTypes.any,
    disableUpload: PropTypes.bool,
    disableRemove: PropTypes.bool,
    onImageChange: PropTypes.func,
    onError: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(ImageUpload);
