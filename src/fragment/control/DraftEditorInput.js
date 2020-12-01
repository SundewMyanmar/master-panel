import React, { useState } from 'react';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { makeStyles } from '@material-ui/core';
import { ContentState, convertFromHTML } from 'draft-js';
import { convertToHTML } from 'draft-convert';

const styles = makeStyles(theme => ({
    DraftInput: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    AppHeader: {
        backgroundColor: theme.palette.background.default,
        minHeight: '5vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'calc(10px + 2vmin)',
        color: theme.palette.background.paper,
        marginBottom: '5vh',
        textAlign: 'center',
    },
    wrapperClass: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: 4,
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    },
    editorClass: {
        backgroundColor: theme.palette.background.paper,
        padding: '10px',
        minHeight: 400,
    },
    toolbarClass: {
        border: '0px solid #ccc',
        borderBottom: '1px solid #ccc',
    },
}));

export type DraftEditorInputProps = {
    value?: Object,
    onChange?: Object,
};

const DraftEditorInput = (props: DraftEditorInputProps) => {
    const { id, name, value, onChange, ...rest } = props;

    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    // const [convertedContent, setConvertedContent] = useState(null);
    const classes = styles();

    /*AVAILABLE PROPERTIES
    ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history']
    REF: https://jpuri.github.io/react-draft-wysiwyg/#/docs
    */

    const options = ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'remove', 'history'];

    React.useEffect(() => {
        if (value) {
            const blocksFromHTML = convertFromHTML(value);
            let result = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);

            setEditorState(EditorState.createWithContent(result));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleEditorChange = state => {
        setEditorState(state);
        convertContentToHTML();
    };

    const convertContentToHTML = () => {
        let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
        // setConvertedContent(currentContentAsHTML);

        if (onChange)
            onChange({
                target: {
                    name: id || name,
                    value: currentContentAsHTML,
                },
            });
    };

    return (
        <div className={classes.DraftInput}>
            <Editor
                id={id || name}
                {...rest}
                name={id || name}
                toolbar={{ options: options }}
                defaultEditorState={editorState}
                onEditorStateChange={handleEditorChange}
                editorState={editorState}
                wrapperClassName={classes.wrapperClass}
                editorClassName={classes.editorClass}
                toolbarClassName={classes.toolbarClass}
            />
        </div>
    );
};

export default DraftEditorInput;
