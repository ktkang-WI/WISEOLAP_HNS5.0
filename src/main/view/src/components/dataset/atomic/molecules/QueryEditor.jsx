import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/ext-inline_autocomplete';

const QueryEditor = ({editorRef, ...props}) => {
  return (
    /**
     * @Author : KJH
     * @Explain : Drag and Drop 을 적용하기 위해 추가 작성
     * @Date : 20231214
     */
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
