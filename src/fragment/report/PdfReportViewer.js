import React, { useState } from 'react';
import { AppBar, Toolbar, Tooltip, ButtonGroup, Button, Icon, Typography, Grid, makeStyles } from '@material-ui/core';
import { Document, Page, pdfjs } from 'react-pdf';
import { withRouter } from 'react-router';
import FormatManager from '../../util/FormatManager';
import { useDispatch } from 'react-redux';
import { ALERT_REDUX_ACTIONS } from '../../util/AlertManager';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const styles = makeStyles((theme) => ({
    root: {},
    ReportViewer: {
        overflowX: 'auto',
        overflowY: 'auto',
        width: '100%',
        marginTop: theme.spacing(2),
    },
    ReportMenuBar: {
        border: '1px solid #cbcbcb',
        background: '#dadada',
    },
    ButtonGroup: {
        background: '#dadada',
    },
    Text: {
        color: theme.palette.primary.main,
        textAlign: 'center',
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    ReportContainer: {
        padding: 0,
        background: theme.palette.background.default,
    },
    ReportContent: {
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
}));

export interface PdfReportViewerProps {
    title: String;
    url: String;
    scaleSize: Any;
    onFilter: Any;
}

const PdfReportViewer = (props: PdfReportViewerProps) => {
    const { title, url, scaleSize, onFilter } = props;
    const classes = styles();
    const dispatch = useDispatch();
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [scale, setScale] = useState(scaleSize);
    const [pdfUrl, setPdfUrl] = useState(url);

    React.useEffect(() => {
        if (url != pdfUrl) setPdfUrl(url);
    }, [url, pdfUrl]);

    const onDocumentLoadSuccess = (obj) => {
        setPageCount(obj._pdfInfo.numPages);
    };

    const handleFilter = () => {
        if (onFilter) {
            onFilter();
        }
    };

    const onPrint = async (url) => {
        FormatManager.printPdf(
            url,
            () => {
                dispatch({ type: ALERT_REDUX_ACTIONS.SHOW_LOADING });
            },
            () => {
                dispatch({ type: ALERT_REDUX_ACTIONS.HIDE });
            },
            handleError,
        );
    };

    const handleError = (error) => {
        dispatch({
            type: ALERT_REDUX_ACTIONS.SHOW,
            alert: error || 'Please check your internet connection and try again.',
        });
    };

    const addPageNumber = (value) => {
        let pageNum = currentPage;
        if (pageNum + value <= 0) {
            pageNum = pageCount;
        } else if (pageNum + value > pageCount) {
            pageNum = 1;
        } else {
            pageNum += value;
        }

        setCurrentPage(pageNum);
    };

    const reload = () => {
        setPdfUrl('');
    };

    const addScale = (value) => {
        if ((value < 0 && scale < 0.7) || (value > 0 && scale > 2.0)) {
            return;
        }
        setScale(scale + value);
    };

    const renderReportNav = () => {
        return (
            <ButtonGroup disableElevation size="small" variant="contained" aria-label="small outlined button group">
                <Button
                    className={classes.ButtonGroup}
                    onClick={() => {
                        setCurrentPage(1);
                    }}
                >
                    <Tooltip title="First">
                        <Icon color="primary">first_page</Icon>
                    </Tooltip>
                </Button>
                <Button className={classes.ButtonGroup} onClick={() => addPageNumber(-1)}>
                    <Tooltip title="Previous">
                        <Icon color="primary">keyboard_arrow_left</Icon>
                    </Tooltip>
                </Button>
                <Typography variant="h6" component="h6" className={classes.Text} noWrap>
                    {`${currentPage} / ${pageCount}`}
                </Typography>
                <Button className={classes.ButtonGroup} onClick={() => addPageNumber(1)}>
                    <Tooltip title="Next">
                        <Icon color="primary">keyboard_arrow_right</Icon>
                    </Tooltip>
                </Button>
                <Button
                    className={classes.ButtonGroup}
                    onClick={() => {
                        setCurrentPage(pageCount);
                    }}
                >
                    <Tooltip title="Last">
                        <Icon color="primary">last_page</Icon>
                    </Tooltip>
                </Button>
            </ButtonGroup>
        );
    };

    return (
        <>
            <div className={classes.ReportViewer}>
                <AppBar position="static" color="transparent" className={classes.ReportMenuBar}>
                    <Toolbar>
                        <Grid container spacing={3}>
                            <Grid container item xs={12} md={3} direction="column" alignItems="flex-start" justifyContent="center">
                                <Typography variant="h6" component="h1" className={classes.Text} noWrap>
                                    <Grid container spacing={1}>
                                        <Grid item>
                                            <Icon style={{ marginTop: 4 }}>pie_chart</Icon>
                                        </Grid>
                                        <Grid item>{title}</Grid>
                                    </Grid>
                                </Typography>
                            </Grid>
                            <Grid item container xs={12} md={6} direction="column" alignItems="center" justifyContent="center">
                                {renderReportNav()}
                            </Grid>

                            <Grid item container xs={12} md={3} direction="column" alignItems="flex-end" justifyContent="center">
                                <ButtonGroup
                                    disableElevation
                                    size="small"
                                    variant="contained"
                                    color="default"
                                    aria-label="small outlined button group"
                                >
                                    <Button className={classes.ButtonGroup} onClick={() => reload()}>
                                        <Tooltip title="Reload">
                                            <Icon color="primary">autorenew</Icon>
                                        </Tooltip>
                                    </Button>
                                    <Button className={classes.ButtonGroup} onClick={() => addScale(-0.1)}>
                                        <Tooltip title="Zoom Out">
                                            <Icon color="primary">zoom_out</Icon>
                                        </Tooltip>
                                    </Button>
                                    <Button className={classes.ButtonGroup} onClick={() => addScale(0.1)}>
                                        <Tooltip title="Zoom In">
                                            <Icon color="primary">zoom_in</Icon>
                                        </Tooltip>
                                    </Button>
                                    <Button className={classes.ButtonGroup} onClick={() => onPrint(url)}>
                                        <Tooltip title="Print">
                                            <Icon color="primary">print</Icon>
                                        </Tooltip>
                                    </Button>
                                    {onFilter && (
                                        <Button className={classes.ButtonGroup} onClick={() => handleFilter()}>
                                            <Tooltip title="Filter">
                                                <Icon color="primary">tune</Icon>
                                            </Tooltip>
                                        </Button>
                                    )}
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <Grid className={classes.ReportContainer} container alignItems="center" justify="center">
                    <Grid item>
                        <div className={classes.ReportContent}>
                            <Document file={pdfUrl} onLoadSuccess={(pdfInfo) => onDocumentLoadSuccess(pdfInfo)} noData="" loading="Loading...">
                                <Page pageNumber={currentPage} scale={scale} />
                            </Document>
                        </div>
                    </Grid>
                </Grid>
                {pdfUrl && (
                    <AppBar position="static" color="transparent" className={classes.ReportMenuBar}>
                        <Toolbar>
                            <Grid container spacing={3}>
                                <Grid container item xs={12} md={3} direction="column" alignItems="flex-start" justifyContent="center"></Grid>
                                <Grid item container xs={12} md={6} direction="column" alignItems="center" justifyContent="center">
                                    {renderReportNav()}
                                </Grid>
                                <Grid item container xs={12} md={3} direction="column" alignItems="flex-end" justifyContent="center"></Grid>
                            </Grid>
                        </Toolbar>
                    </AppBar>
                )}
            </div>
        </>
    );
};

PdfReportViewer.defaultProps = {
    title: 'Report Viewer',
    scaleSize: 1.3,
};

export default withRouter(PdfReportViewer);
