import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {dataSource}
  from 'components/dataset/atomic/organism/CustomData/Data/customObjectList';
import {List, TextArea} from 'devextreme-react';
import {useEffect, useState} from 'react';

/* 사용자 정의 데이터 객체 정보 및 설명
@Autor : KIM JAE HYEON
@Date : 20231215 */
const CalcObjectList = ({...props}) => {
  // #################################### 변수 선언 시작
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
  // #################################### 초기화 종료
  // #################################### 함수 시작
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
  // #################################### 함수 종료
  return (
    <>
      <Wrapper>
        <List
          // TODO: 스타일 위치 변경해야함. 회의 필요. ? Styled-componentd? 위치는?
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
          // TODO: 스타일 위치 변경해야함. 회의 필요. ? Styled-componentd? 위치는?
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
    </>
  );
};

export default CalcObjectList;
