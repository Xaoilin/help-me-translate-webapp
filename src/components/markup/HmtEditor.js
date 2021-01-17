import React from "react";
import {Editor} from "@tinymce/tinymce-react/lib/cjs/main/ts";

export default class HmtEditor extends React.Component {

    constructor(props) {
        super(props);

        this.state = { content: '' };
        this.editor = null;
        this.handleEditorChange = this.handleEditorChange.bind(this);

    }

    handleEditorChange(content, editor) {
        this.setState({ content });
        this.props.onChange(content);
        console.log("content: " + content);
    }

    render() {
        return (
            <>
                <Editor
                    id={this.props.type}
                    initialValue={this.props.initialValue}
                    apiKey={"jfp4se9a2jbzf8ejds1gzptmni2iencjgbocodeqf6wb0z6f"}
                    init={{
                        setup: (editor) => this.editor = editor,
                        height: 500,
                        width: '50%',
                        menubar: false,
                        plugins: [
                            'advlist autolink lists link image',
                            'charmap print preview anchor help',
                            'searchreplace visualblocks code',
                            'insertdatetime media table paste wordcount'
                        ],
                        toolbar:
                            'undo redo | formatselect | bold italic | \
                            alignleft aligncenter alignright | \
                            bullist numlist outdent indent | help'
                    }}
                    value={this.props.value}
                    onEditorChange={this.handleEditorChange}
                />
            </>
        );
    }
}