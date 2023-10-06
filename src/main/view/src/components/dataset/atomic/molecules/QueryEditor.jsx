import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/ext-inline_autocomplete';

const QueryEditor = ({editorRef, ...props}) => {
  return (
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
      value={``}
      setOptions={{
        enableBasicAutocompletion: false,
        enableLiveAutocompletion: true,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2
      }}
      {...props}
    />
  );
};

export default QueryEditor;
