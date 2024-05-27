import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/theme-monokai';
import './mode-custom';
import {useContext, useEffect, useState} from 'react';
import {CustomDataCalContext}
  from 'components/dataset/modal/CustomData/CustomDataCalcModal';
import localizedString from 'config/localization';

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

  const handleParenthesisException = (lines) => {
    const stack = [];

    for (let i = 0; i < lines.length; i++) {
      const char = lines[i];

      if (char === '(') {
        stack.push(char);
      } else if (char === ')') {
        if (stack.length === 0) {
          return false;
        } else {
          stack.pop();
        }
      }
    }

    return stack.length === 0;
  };

  const handleLineException = (lines) => {
    const newAnnotations = [];
    let addedLine = '';
    lines.forEach((line, index) => {
      const operPatternCase1 = /[\*+-\/]{2,}\s{0,}/g;
      const operPatternCase2 = /(\]\s{0,}\d)|(\d\s{0,}\[)/g;
      const numberPattern = /\d\s{1,}\d/g;
      const parenthesisEmpty = /\(\s*\)/g;
      const aggregationCase = /SUM|AVG|MIN|MAX/g;
      let test = '';
      addedLine = addedLine.concat(line+' ');

      test = addedLine.replaceAll(/\[.*?\]/gmi, '');
      test = test.replaceAll(/[\*+-\/\s\d()]/gmi, '');

      const errorCheck =
        !handleParenthesisException(addedLine) ||
        test.length > 0 ||
        operPatternCase1.exec(addedLine) ||
        numberPattern.exec(addedLine) ||
        parenthesisEmpty.exec(addedLine) ||
        operPatternCase2.exec(addedLine);

      const aggregateCheck =
      aggregationCase.exec(addedLine);

      if (errorCheck) {
        const message =
          aggregateCheck ?
            localizedString.alertInfo.errorNamingOfAggregateFunc :
            localizedString.alertInfo.customDataCalc.Inspection;
        newAnnotations.push({
          row: index,
          column: 0,
          type: 'error',
          text: message
        });
        handleCheck(false);
      } else {
        handleCheck(true);
      }
    });
    setAnnotations(newAnnotations);
  };

  useEffect(() => {
    if (props.value) {
      const validateCode = () => {
        const lines = props.value.split('\n');
        handleLineException(lines);
      };
      validateCode();
    };
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
