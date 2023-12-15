import {useContext, useEffect, useRef} from 'react';
import QueryEditor from '../../QueryEditor';
import {CustomDataCalContext}
  from 'components/dataset/modal/CustomData/CustomDataCalcModal';

/* 사용자 정의 데이터 표현식정의
@Autor : KIM JAE HYEON
@Date : 20231215 */
const CalcDefineArea = ({...props}) => {
  // #################################### 변수 선언 시작
  const getContext = useContext(CustomDataCalContext);
  const queryEditorRef = useRef();
  const [customData, setCustomData] = getContext.state.customData;
  // #################################### 변수 선언 종료
  // #################################### 초기화 시작
  useEffect(()=>{
    // 입력창 커서 맨뒤로 이동
    moveToEnd();
  }, [customData]);
  // #################################### 초기화 종료
  // #################################### 함수 시작
  const moveToEnd = () => {
    const editor = queryEditorRef.current.editor;
    const doc = editor.getSession().getDocument();
    const row = doc.getLength();
    const column = doc.getLine(doc.getLength() - 1).length;
    editor.gotoLine(row, column);
  };
  // TODO: 공용함수 정의필요
  const valueNullCheck = (value) => {
    return (value == undefined ||
     value == 'undefined') ? true : false;
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
          valueNullCheck(prev.calculation) ?
          ev.dataTransfer.getData('value') :
          prev.calculation + ev.dataTransfer.getData('value')
      };
    });
  };
  const handleQueryEditor = () => {
    setCustomData((prev) => {
      return {
        ...prev,
        calculation: queryEditorRef.current.editor.getValue()
      };
    });
  };
  // #################################### 함수 종료
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
