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

export interface SettingAccordionProps {
  setting?: Object;
  onSubmit: (Object) => void,
  onError: (Object) => void,
  expanded: Boolean,
  data: Object,
  onAccordionChange: (Object) => void,
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

const SettingAccordion = (props: SettingAccordionProps) => {
  const classes = styles();
  const { setting, data, expanded, onAccordionChange, onSubmit, onError } = props;
  const [accordionExpand, setAccordionExpand] = useState(false);
  const [structure, setStructure] = useState([]);
  const [settingData, setSettingData] = useState({});

  React.useEffect(() => {
    setAccordionExpand(expanded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  React.useEffect(() => {
    if (data)
      setSettingData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const getType = (type) => {
    switch (type) {
      case "NUMBER": return "number";
      case "LIST": return "chip";
      case "MAP": return "chip";
      case "BOOL": return "checkbox";
      default: return "TEXT";
    }
  }

  React.useEffect(() => {
    let structureList = [];
    for (let i = 0; i < setting.structure.length; i++) {
      let name = setting.structure[i].name;
      let type = getType(setting.structure[i].type);
      let value = settingData[name];
      let checked = {};
      let icon = { icon: 'code' };

      if (type == 'chip' && value && typeof value !== "string") {
        value = value.join(',');
      }

      if (type == 'checkbox') {
        checked = { checked: value }
        icon = {};
      }

      structureList.push({
        ...setting.structure[i],
        required: false,
        type: type,
        value: value,
        ...checked,
        ...icon
      })
    }

    setStructure(structureList);

    return {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingData]);

  const updateSettingData = (newData) => {
    setSettingData(newData);
  }

  const handleSubmit = () => {
    if (onSubmit) onSubmit(settingData, setting.fullName, updateSettingData, structure);
  }

  const fieldOnChange = (event, data) => {
    let value = event.target.value;
    if (event.target.type == 'checkbox')
      value = event.target.checked;

    setSettingData({
      ...settingData,
      [event.target.name]: value,
    });
  }

  return (
    <Accordion style={{ width: '100%' }} expanded={accordionExpand === setting.fullName} onChange={onAccordionChange(setting.fullName)}>
      <AccordionSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1bh-content" id="panel1bh-header">
        <Icon className={classes.icon}>{setting.icon || 'settings'}</Icon>
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

SettingAccordion.defaultProps = {
  setting: {},
  expanded: '',
  data: [],
  onSubmit: (data) => console.log('Accordion Submit', data),
  onAccordionChange: (data) => console.log('Accordion Change', data)
}

export default SettingAccordion;
