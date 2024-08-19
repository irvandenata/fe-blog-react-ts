import React, { FC, useEffect, useState } from "react";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html"; // Pastikan untuk menginstal library ini
import htmlToDraft from "html-to-draftjs"; // Pastikan untuk menginstal library ini

const TextEditor: FC<{
    content?: any;
    field?: any;
}> = ({ content, field }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    useState(() => {
        const blocksFromHtml = htmlToDraft("");
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap
        );
        setEditorState(EditorState.createWithContent(contentState));
        console.log("content use state");
    });

    useEffect(() => {
        if (content) {
            const { contentBlocks, entityMap } = content;
            const contentState = ContentState.createFromBlockArray(
                contentBlocks,
                entityMap
            );
            setEditorState(EditorState.createWithContent(contentState));
        }
    }, [content]);
    const onEditorStateChange = (editorState: any) => {
        field.current = draftToHtml(
            convertToRaw(editorState.getCurrentContent())
        );
        setEditorState(editorState);
    };

    return (
        <div className="min-h-[600px] border rounded p-5">
            <Editor
                editorState={editorState}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={onEditorStateChange}
            />
        </div>
    );
};

export default TextEditor;
