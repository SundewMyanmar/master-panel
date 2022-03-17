import React, { useState } from 'react';
import {
    Typography,
    Container,
    Paper,
    Avatar,
    Icon,
    makeStyles,
    Grid,
    Button,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Checkbox,
    Collapse,
    List,
    Divider,
} from '@material-ui/core';
import MasterForm from '../fragment/MasterForm';

export interface SettingAccordionProps{
  setting?:Object;
  onSubmit:(Object)=>void,
  onError:(Object)=>void,
  expanded:Boolean,
  data:Object,
  onAccordionChange:(Object)=>void,
}

const styles = makeStyles((theme) => ({
    submit: {
        height: 55,
        marginTop: theme.spacing(1),
    },
    icon: {
        marginRight: theme.spacing(1),
    },
}));

const SettingAccordion=(props:SettingAccordionProps)=>{
    const classes = styles();
    const {setting, data,expanded,onAccordionChange,onSubmit,onError}=props;
    const [accordionExpand,setAccordionExpand]=useState(false);
    const [structure,setStructure]=useState([]);
    const [settingData,setSettingData]=useState({});

    React.useEffect(()=>{
      setAccordionExpand(expanded);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[expanded]);

    React.useEffect(()=>{
      if(data)
        setSettingData(data);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data]);

    React.useEffect(() => {
        let structureList=[];
        for(let i=0;i<setting.structure.length;i++){
          let name=setting.structure[i].name;

          structureList.push({
            ...setting.structure[i],
            icon:'code',
            required:false,
            type:'text',
            value:settingData[name]
          })
        }
        setStructure(structureList);
        console.log('structure list',structureList);

        return {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[settingData]);

    const updateSettingData=(newData)=>{
        console.log('saved new data',newData);
        setSettingData(newData);
    }

    const handleSubmit=()=>{
      if(onSubmit)onSubmit(settingData,setting.fullName,updateSettingData);
    }

    const fieldOnChange=(event, data)=>{
      setSettingData({
          ...settingData,
          [event.target.name]: event.target.value,
      });
    }

    return(
      <Accordion style={{width:'100%'}} expanded={accordionExpand === setting.fullName} onChange={onAccordionChange(setting.fullName)}>
          <AccordionSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1bh-content" id="panel1bh-header">
              <Icon className={classes.icon}>{setting.icon||'settings'}</Icon>
              <Typography sx={{ width: '33%', flexShrink: 0 }}>{setting.label || 'Setting'}</Typography>
          </AccordionSummary>
          <AccordionDetails>
              <MasterForm fields={structure} onChange={fieldOnChange}>
                  <Grid container justifyContent="flex-end">
                      <Button type="button" onClick={() => handleSubmit()} variant="contained" color="primary" className={classes.submit}>
                          <Icon>save</Icon> Save
                      </Button>
                  </Grid>
              </MasterForm>
          </AccordionDetails>
      </Accordion>
    )
}

SettingAccordion.defaultProps={
  setting:{},
  expanded:'',
  data:[],
  onSubmit:(data)=>console.log('Accordion Submit',data),
  onAccordionChange:(data)=>console.log('Accordion Change',data)
}

export default SettingAccordion;
