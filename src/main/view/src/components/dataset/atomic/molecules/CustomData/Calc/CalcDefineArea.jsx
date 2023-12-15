import {useContext, useEffect, useRef, useState} from 'react';
import QueryEditor from '../../QueryEditor';
import {CustomDataCalContext}
  from 'components/dataset/modal/CustomData/CustomDataCalcModal';

// 사용자 정의 데이터 표현식정의
const CalcDefineArea = () => {
  const getContext = useContext(CustomDataCalContext);
  const queryEditorRef = useRef();
  const [customData, setCustomData] = getContext.state.customData;
  const [isDragEvent, setIsDragEvent] = useState(false);

  useEffect(()=>{
    // 입력창 커서 맨뒤로 이동
    if (isDragEvent) moveToEnd();
    return () => {
      setIsDragEvent(false);
    };
  }, [customData]);

  const moveToEnd = () => {
    const editor = queryEditorRef.current.editor;
    const doc = editor.getSession().getDocument();
    const row = doc.getLength();
    const column = doc.getLine(doc.getLength() - 1).length;
    editor.gotoLine(row, column);
  };
  const handleToAllowDrop = (ev) => {
    ev.preventDefault();
  };
  const handleToDrop = (ev) => {
    ev.preventDefault();
    setCustomData((prev) => {
      return {
        ...prev,
        calculation:
          (!prev.calculation) ?
          ev.dataTransfer.getData('value') :
          prev.calculation + ev.dataTransfer.getData('value')
      };
    });
    setIsDragEvent(true);
  };
  const handleQueryEditor = () => {
    setCustomData((prev) => {
      return {
        ...prev,
        calculation: queryEditorRef.current.editor.getValue()
      };
    });
  };

  return (
    <>
      <QueryEditor
        editorRef={queryEditorRef}
        value={customData.calculation}
        onDrop={handleToDrop}
        onDragOver={handleToAllowDrop}
        onChange={handleQueryEditor}
      />
    </>
  );
};

export default CalcDefineArea;
