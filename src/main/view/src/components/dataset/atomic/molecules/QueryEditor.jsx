import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/ext-inline_autocomplete';
import 'ace-builds/src-noconflict/ext-searchbox';
import {useEffect} from 'react';

const QueryEditor = ({editorRef, ...props}) => {
  useEffect(() => {
    const editor = editorRef.current.editor;

    editor.commands.addCommand({
      name: 'customSearch',
      bindKey: {win: 'Ctrl-F', mac: 'Command-F'},
      exec: () => {
        editor.execCommand('find');
      }
    });
  }, []);

  return (
    <div style={{width: '100%', height: '100%'}}
      onDragOver={props.onDragOver}
      onDrop={props.onDrop}>
      <AceEditor
        placeholder=""
        mode="sql"
        theme="xcode"
        name="blah2"
        fontSize={14}
        width='100%'
        height='100%'
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        ref={editorRef}
        value={''}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: true,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2
        }}
        {...props}
      />
    </div>
  );
};

export default QueryEditor;
