import React, { useState } from 'react';
import { Container, Paper, Avatar, Icon, Typography, Grid, Button, makeStyles, useTheme, ThemeProvider, IconButton } from '@material-ui/core';
import DataTable from '../fragment/table';
import { TextInput, ListInput, ColorInput, IconInput, NumberInput } from '../fragment/control';
import { useDispatch } from 'react-redux';
import { ALERT_REDUX_ACTIONS } from '../util/AlertManager';
import { validateForm } from '../util/ValidationManager';
import type { GridProps } from '@material-ui/core';
import FormatManager from '../util/FormatManager';

export const BLOOD_PRESSURE_TABLE_FIELDS = [
    {
        name: 'recorededAt',
        label: 'Recorded',
        type: 'raw',
        align: 'center',
        onLoad: (data, rowIdx) => FormatManager.formatDate(data.recordedAt, 'yyyy-MM-dd HH:mm:ss'),
    },
    {
        name: 'systolic',
        label: 'Systolic',
        align: 'center',
    },
    {
        name: 'diastolic',
        label: 'Diastolic',
        align: 'center',
    },
    {
        name: 'remark',
        label: 'Remark',
    },
];

const styles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    submit: {
        marginLeft: theme.spacing(1),
    },
}));

export interface BloodPressureFormProps extends GridProps {
    data?: Array<Object>;
    onChange: (Array<Object>) => void;
}

const BloodPressureForm = (props: BloodPressureFormProps) => {
    const theme = useTheme();
    const classes = styles();
    const { data, onChange, ...rest } = props;
    const dispatch = useDispatch();
    const [bloodPressure, setBloodPressure] = useState({});
    const [selectedIdx, setSelectedIdx] = useState(-1);

    const handleSaveBloodPressure = () => {
        console.log('Save BP');
    };

    const handleInputChange = (key, value) => {
        setBloodPressure({ ...contact, [key]: value });
    };

    return (
        <>
            <Grid className={classes.root} container spacing={4} {...rest}>
                <Grid container>
                    <Grid container direction="row" spacing={2}>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <NumberInput
                                id="systolic"
                                label="Systolic"
                                value={bloodPressure?.systolic}
                                type="integer"
                                onChange={(event) => {
                                    handleInputChange('systolic', event.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                            <NumberInput
                                id="diastolic"
                                label="Diastolic"
                                value={bloodPressure?.diastolic}
                                type="integer"
                                onChange={(event) => {
                                    handleInputChange('diastolic', event.target.value);
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={1}>
                        <Grid item lg={10} md={9} sm={8} xs={12}>
                            <TextInput
                                id="remark"
                                label="Remark"
                                value={bloodPressure?.remark}
                                onChange={(event) => {
                                    handleInputChange('remark', event.target.value);
                                }}
                                required
                            />
                        </Grid>
                        <Grid container item direction="row" lg={2} md={3} sm={4} xs={12} justifyContent="flex-end" alignItems="center">
                            <Button
                                type="submit"
                                className={classes.submit}
                                size="large"
                                variant="contained"
                                color="primary"
                                onClick={handleSaveBloodPressure}
                            >
                                <Icon>archive</Icon> Record
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container>
                    <DataTable
                        title="Blood Pressures"
                        disablePaging={true}
                        items={data}
                        onEdit={(item, index) => {
                            setBloodPressure(item);
                            setSelectedIdx(index);
                        }}
                        fields={BLOOD_PRESSURE_TABLE_FIELDS}
                    />
                </Grid>
            </Grid>
        </>
    );
};

BloodPressureForm.defaultProps = {
    data: [],
    onChange: (data) => console.log('Blood Pressure Data Changed => ', data),
};

export default BloodPressureForm;
