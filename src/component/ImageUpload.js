import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router";
import { Icon, Input,IconButton } from '@material-ui/core';

const styles = theme => ({
    container:{
        marginTop:20,
        backgroundColor:'#f0f0f0',
        cursor: 'pointer',
    },
    image_button:{
        float: 'right',
        marginLeft: '-50%',
        marginTop: -12,
        marginRight: -12,
        //position: '-webkit-sticky', /* Safari */
        //position: 'sticky',
        //transform: 'translate(-50%, -50%)',
        
        backgroundColor: '#dd2c00',
        color:'white',
        padding:0,
        width:25,
        height:25,
        fontSize: 12,
        border: 'none',
        cursor: 'pointer',
        borderRadius: 40,
    }
});

class ImageUpload extends React.Component{
    constructor(props){
        super(props);
        this.state={
            previewImage:{}            
        }
    }

    componentDidMount(){
        
    }

    onImageClick(){
        var upload=document.getElementById("imageUpload");
        upload.click();
    }

    onImageChange(callback,_this){
        var files=document.getElementById('imageUpload').files;
        if(files && files.length>0){
            this.setState({
                image:files[0]
            })

            this.processImage(files[0],this);

            if(callback){
                callback(files[0],_this);
            }
        }
    }

    processImage(file,_this){
        var fr = new FileReader();
        fr.onload = function () {
            _this.setState({
                previewImage:fr.result
            }) 
        }
        fr.readAsDataURL(file);
    }

    onRemove(_this){
        _this.setState({
            image:null
        })
    }

    render(){
        const { classes,onImageChange,previewImage,onImageRemove,_this,disableUpload,args,disableRemove} = this.props;
        var {width,height} =this.props;

        var img,visibility;
        if(previewImage){
            img=previewImage;
            if(disableRemove)
                visibility="hidden";
            else
                visibility=true;
        }else{
            if(disableRemove)
                visibility="hidden";
            else
                visibility=this.state.image?"visible":"hidden";
            img=this.state.image?this.state.previewImage:"/res/upload.png";
        }

        if(!width)
            width=200;
        if(!height)
            height=200;
        return(
            <div className={[classes.container]} style={{width:width,height:height}}>
                <img onClick={()=>{
                    if(!disableUpload)
                        this.onImageClick()
                }} src={img} alt="" style={{width:"100%",height:"100%"}}/>
                <IconButton style={{visibility:visibility}} onClick={()=>{
                    this.onRemove(this);
                    if(onImageRemove)
                        onImageRemove(_this,args);
                    }} className={classes.image_button}> 
                    <Icon>close</Icon>
                </IconButton>
                <Input style={{display:'none'}} id="imageUpload" type="file" value={this.state.uploadFile} onChange={(event)=>{
                    this.onImageChange(onImageChange,_this);
                }}/>
            </div>
        )
    }
}

ImageUpload.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles,{ withTheme: true })(ImageUpload));