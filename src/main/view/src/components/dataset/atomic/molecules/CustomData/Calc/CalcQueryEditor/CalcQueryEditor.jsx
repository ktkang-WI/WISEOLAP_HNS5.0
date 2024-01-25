import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-monokai';
import './mode-custom';
import {useContext, useEffect, useState} from 'react';
import {CustomDataCalContext}
  from 'components/dataset/modal/CustomData/CustomDataCalcModal';

const CalcQueryEditor = ({editorRef, ...props}) => {
  const [annotations, setAnnotations] = useState([]);
  const getContext = useContext(CustomDataCalContext);
  const [, setCheckForSaving] = getContext.state.checkForSaving;

  const handleCheck = (isOk) => {
    setCheckForSaving((prev) => {
      return {
        ...prev,
        inspection: isOk
      };
    });
  };

  useEffect(() => {
    const validateCode = () => {
      const newAnnotations = [];

      const lines = props.value.split('\n');
      lines.forEach((line, index) => {
        line = line.replaceAll(/\[.*?\]/gmi, '');
        line = line.replaceAll(/[\*+-\/\s\d()]/gmi, '');

        if (line.length > 0) {
          newAnnotations.push({
            row: index,
            column: 0,
            type: 'error',
            text: '항목에 없는 식별값 입니다.'
          });
          handleCheck(false);
        }
      });
      handleCheck(true);
      setAnnotations(newAnnotations);
    };

    validateCode();
  }, [props.value]);

  useEffect(() => {
    if (editorRef.current) {
      const editorSession = editorRef.current.editor.getSession();
      editorSession.setMode('ace/mode/custom');
    }
  });

  return (
    <div style={{width: '100%', height: '100%'}}
      onDragOver={props.onDragOver}
      onDrop={props.onDrop}>
      <AceEditor
        ref={editorRef}
        mode="custom"
        theme="xcode"
        name="UNIQUE_ID_OF_EDITOR"
        editorProps={{$blockScrolling: true}}
        annotations={annotations}
        placeholder=""
        fontSize={14}
        width='100%'
        height='100%'
        {...props}
      />
    </div>
  );
};

export default CalcQueryEditor;
