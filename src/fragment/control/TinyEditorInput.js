import * as React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { TINY_EDITOR_API_KEY } from '../../config/Constant';

export type TinyEditorInputProps = {
    id: string,
    name: string,
    value: string,
    type: 'TABLE' | 'DEFAULT',
    height: int,
    onChange?: () => void,
};

const TinyEditorInput = (props: TinyEditorInputProps) => {
    const { id, name, value, type, height, onChange, ...rest } = props;
    const [editorContent, setEditorContent] = React.useState(value);

    const tableToolbar =
        'table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol';
    const defaultToolbar =
        'undo redo | bold italic underline strikethrough subscript superscript forecolor backcolor blockquote | formatselect styleselect |\
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat';

    const toolbar = type === 'TABLE' ? `${tableToolbar}|${defaultToolbar} | help` : `${defaultToolbar}|${tableToolbar}| help`;

    React.useEffect(() => {
        const newValue = FormatManager.defaultNull(value) || '';
        if (newValue !== content) {
            handleEditorChange(newValue, null);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleEditorChange = (content, editor) => {
        setEditorContent(content);
        if (onChange)
            onChange({
                target: {
                    id: id || name,
                    name: id || name,
                    value: content,
                },
            });
    };

    return (
        <div style={{ paddingTop: 14, paddingBottom: 14 }}>
            <Editor
                id={id || name}
                name={id || name}
                {...rest}
                initialValue={editorContent}
                value={editorContent}
                init={{
                    height: height,
                    menubar: false,
                    plugins: [
                        'advlist lists image charmap preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'table paste code help wordcount',
                    ],
                    toolbar: toolbar,
                }}
                //TINY Editor Key
                apiKey={TINY_EDITOR_API_KEY}
                onEditorChange={handleEditorChange}
            />
        </div>
    );
};

TinyEditorInput.defaultProps = {
    type: 'DEFAULT',
    height: 500,
};

export default TinyEditorInput;
