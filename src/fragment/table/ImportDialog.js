import React from 'react';
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Zoom,
    Grid,
    makeStyles,
    Divider,
    Typography,
    Icon,
    LinearProgress,
    DialogActions,
} from '@material-ui/core';
import DataTable from '.';
import FormatManager from '../../util/FormatManager';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom in ref={ref} {...props} />;
});

export type ImportDialgProps = {
    show: boolean,
    fields: Array,
    title: string,
    onClose?: (result: Object) => void,
};

const styles = makeStyles(theme => ({
    content: {
        backgroundColor: theme.palette.background.default,
        borderBottom: '1px solid ' + theme.palette.divider,
        padding: 0,
    },
    header: {
        padding: theme.spacing(1, 2),
    },
    noLoading: {
        height: 4,
        display: 'block',
    },
    icon: {
        marginRight: theme.spacing(0.5),
    },
}));

const CSV_REGEX = {
    seperator: /,|;|:|\|/g,
    jsonPattern: /(\[[^\]]*]+)|(\{[^}]*}+)/g,
    seperatorCleaner: /(",")/g,
    escape: /""/g,
    trim: /^("|\n|\r)|("|\n|\r)$/g,
    validName: /[^a-zA-Z0-9\\._]/g,
    tempJSON: '@json_data',
    invalidColumn: '<invalid>',
};

export const CsvReader = (fields, input) => {
    let output = [];
    let headers = [];
    input.split(/\r\n|\n/g).forEach((line, idx) => {
        const row = line.replace(CSV_REGEX.seperatorCleaner, ',').replace(CSV_REGEX.trim, '');
        if (row.length > 0) {
            if (idx === 0) {
                headers = row.split(CSV_REGEX.seperator).map(val => {
                    const header = FormatManager.snakeToCamel(val.replace(CSV_REGEX.validName, '_'));
                    const validIdx = fields.findIndex(f => f.name.toLowerCase() === header.toLowerCase());
                    if (validIdx >= 0) {
                        return fields[validIdx];
                    } else {
                        return CSV_REGEX.invalidColumn;
                    }
                });
            } else {
                const innerValues = row.match(CSV_REGEX.jsonPattern);
                const values = row.replace(CSV_REGEX.jsonPattern, CSV_REGEX.tempJSON).split(CSV_REGEX.seperator);
                let item = {};
                let jsonIdx = 0;
                headers.forEach((prop, col) => {
                    if (prop === CSV_REGEX.invalidColumn) {
                        return;
                    }

                    let value = values[col].trim().replace(CSV_REGEX.escape, '"');
                    if (value === CSV_REGEX.tempJSON) {
                        value = innerValues[jsonIdx].replace(CSV_REGEX.escape, '"');
                        try {
                            value = JSON.parse(value);
                        } catch (error) {
                            console.warn(error);
                        } finally {
                            jsonIdx++;
                        }
                    }
                    item[prop.name] = value;
                });
                output.push(item);
            }
        }
    });
    return output;
};

export default function ImportDialog(props: ImportDialgProps) {
    const classes = styles();
    const { title, fields, onClose, show } = props;
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState('Please upload a csv file.');
    const [data, setData] = React.useState([]);
    const inputUpload = React.createRef();

    const handleClose = isSubmit => {
        if (isSubmit && data && data.length > 0) {
            onClose(data);
        } else {
            onClose(false);
        }
        setData([]);
    };

    const handleUploadChange = event => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setLoading(true);
            const file = files[0];
            const fileReader = new FileReader();
            fileReader.onload = () => {
                if (file.type.endsWith('csv') || file.name.endsWith('csv')) {
                    try {
                        const csv = CsvReader(fields, fileReader.result);

                        setData(csv);
                    } catch (error) {
                        setMessage(error);
                    } finally {
                        setLoading(false);
                    }
                }
            };
            fileReader.readAsText(file);
        }
    };

    return (
        <Dialog fullWidth maxWidth="lg" open={show} onEscapeKeyDown={() => onClose(false)} TransitionComponent={Transition}>
            <DialogTitle className={classes.header}>
                <Grid container>
                    <Grid container item lg={6} md={6} sm={12} xs={12} alignItems="center" justify="flex-start">
                        <Typography color="primary" variant="h6" component="h1" noWrap>
                            {title}
                        </Typography>
                    </Grid>
                    <Grid container item lg={6} md={6} sm={12} xs={12} alignItems="center" justify="flex-end">
                        <Button
                            type="button"
                            color="secondary"
                            onClick={() => inputUpload.current.click()}
                            variant="contained"
                            aria-label="Upload File"
                        >
                            <Icon className={classes.icon}>computer</Icon>Browse ...
                        </Button>
                    </Grid>
                </Grid>
            </DialogTitle>
            <Divider />
            <DialogContent className={classes.content}>
                {loading ? <LinearProgress /> : <div className={classes.noLoading}></div>}
                <DataTable items={data} fields={fields} noData={message} disablePaging={true} />
            </DialogContent>
            <DialogActions>
                <input
                    ref={inputUpload}
                    style={{ display: 'none' }}
                    name="uploadFile"
                    accept=".csv, .txt"
                    type="file"
                    onChange={handleUploadChange}
                />
                <Button onClick={() => handleClose(true)} color="primary" variant="contained">
                    <Icon>done</Icon> Ok
                </Button>
                <Button onClick={() => handleClose(false)} color="default" variant="contained">
                    <Icon>close</Icon> Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ImportDialog.defaultProps = {
    onError: error => console.warn('Undefined onError => ', error),
    onClose: result => console.warn('Undefined onClose => ', result),
};
