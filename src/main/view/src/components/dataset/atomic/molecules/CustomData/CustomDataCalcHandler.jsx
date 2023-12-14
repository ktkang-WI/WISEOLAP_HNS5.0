import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import QueryEditor from '../QueryEditor';
import {List, TextArea, TextBox} from 'devextreme-react';
import {useContext, useEffect, useRef, useState} from 'react';
import {CustomDataCalContext}
  from 'components/dataset/modal/CustomData/CustomDataCalcModal';
import {dataSource} from './Data/customObjectList';

/* 사용자 정의 데이터 계산식 매개변수,열,함수 등등을 이용하여 계산식을 정의합니다.
@Autor : KIM JAE HYEON
@Date : 20231214 */
const CustomDataCalcHandler = ({...props}) => {
  // #################################### 변수 선언 시작
  const queryEditorRef = useRef();
  const textBoxRef = useRef();
  const getContext = useContext(CustomDataCalContext);
  const [customData, setCustomData] = getContext.state.customData;
  // 열,상수,연산자,함수 값 저장
  const [objectList, setObjectList] = useState();
  // 열,상수,연산자,함수 클릭값
  const [selectedObjectList, setSelectedObjectList] = useState();
  // 열,상수,연산자,함수 내부 값
  const [objectListContents, setObjectListContents] = useState([]);
  // 열,상수,연산자,함수 내부 값 사용설명
  const [explain, setExplain] = useState('');
  // #################################### 변수 선언 종료
  // #################################### 초기화 시작
  useEffect(()=>{
    setObjectList(dataSource.map((item)=>item.key));
  }, []);
  useEffect(()=>{
    // 입력창 커서 맨뒤로 이동
    moveToEnd();
  }, [customData]);
  // #################################### 초기화 종료
  // #################################### 함수 시작
  // ##### 내부 컴포넌트 함수 시작 #####
  const handleQueryEditor = () => {
    setCustomData((prev) => {
      return {
        ...prev,
        calculation: queryEditorRef.current.editor.getValue()
      };
    });
  };
  const handleTextBox = (data) => {
    setCustomData((prev) => {
      return {
        ...prev,
        fieldName: data.value
      };
    });
  };
  // TODO: 공용함수로 상의후 이동
  const valueNullCheck = (value) => {
    return (value == undefined ||
     value == 'undefined') ? true : false;
  };
  const handleFromDragStart = (e) => {
    e.dataTransfer.setData('value', e.target.innerText);
  };
  // 열,상수,연산자,함수 의 내용값 출력
  const handleObject = (e) => {
    dataSource.forEach((item) => {
      if (item.key === e.itemData) {
        setSelectedObjectList(item.key);
        setObjectListContents(item.collection.map((item)=>item.key));
      }
    });
  };
  // 열,상수,연산자,함수 의 내용값 설명값 출력
  const handleObjectContent = (e) => {
    dataSource.forEach((item) => {
      if (item.key === selectedObjectList) {
        item.collection.map((item) => {
          if (item.key === e.itemData) {
            setExplain(item.explain);
          }
        });
      }
    });
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
  const moveToEnd = () => {
    const editor = queryEditorRef.current.editor;
    const doc = editor.getSession().getDocument();
    const row = doc.getLength();
    const column = doc.getLine(doc.getLength() - 1).length;
    editor.gotoLine(row, column);
  };
  // ##### 내부 컴포넌트 함수 종료 #####
  // #################################### 함수 종료
  return (
    <>
      <Wrapper size="50%">
        <Wrapper display='flex' direction='column'>
          <Wrapper size="10%">
            <TextBox maxLength={20}
              ref={textBoxRef}
              value={customData.fieldName}
              onValueChanged={handleTextBox}
            />
          </Wrapper>
          <Wrapper size="2px"/>
          <Wrapper>
            <QueryEditor
              editorRef={queryEditorRef}
              value={customData.calculation}
              onDrop={handleToDrop}
              onDragOver={handleToAllowDrop}
              onChange={handleQueryEditor}
            />
          </Wrapper>
        </Wrapper>
      </Wrapper>
      <Wrapper size="50%" display='flex' direction='row'>
        <Wrapper>
          <List
            // TODO: 스타일 위치 변경해야함. 회의 필요.
            style={{
              border: '1px dashed darkgray',
              borderRadius: '8px',
              padding: '10px'
            }}
            dataSource={objectList}
            onItemClick={handleObject}
            width='100%'
            height='250px'>
          </List>
        </Wrapper>
        <Wrapper>
          <List
            // TODO: 스타일 위치 변경해야함. 회의 필요.
            style={{
              border: '1px dashed darkgray',
              borderRadius: '8px',
              padding: '10px'
            }}
            dataSource={objectListContents}
            width='100%'
            height='250px'
            onItemClick={handleObjectContent}
            itemRender={(data) => {
              return (
                <div
                  draggable={true}
                  onDragStart={handleFromDragStart}
                >
                  {data}
                </div>
              );
            }}>
          </List>
        </Wrapper>
        <Wrapper size="2px"/>
        <Wrapper>
          <TextArea
            width='100%'
            height='100%'
            value={explain}
            stylingMode="outlined"
            focusStateEnabled={false}
            hoverStateEnabled={false}
            readOnly={true}
          />
        </Wrapper>
      </Wrapper>
    </>
  );
};

export default CustomDataCalcHandler;
