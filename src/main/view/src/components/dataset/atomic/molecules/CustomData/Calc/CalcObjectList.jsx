import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {dataSource}
  from 'components/dataset/atomic/organism/CustomData/Data/customObjectList';
import {List, TextArea} from 'devextreme-react';
import {useState} from 'react';

// 사용자 정의 데이터 객체 정보 및 설명
const CalcObjectList = () => {
  // 열,상수,연산자,함수 클릭값
  const [selectedObjectList, setSelectedObjectList] = useState();
  // 열,상수,연산자,함수 내부 값 사용설명
  const [explanation, setExplanation] = useState('');

  const handleFromDragStart = (e) => {
    e.dataTransfer.setData('value', e.target.innerText);
  };

  // 열,상수,연산자,함수 의 내용값 출력
  const handleObject = (e) => {
    if (e.itemData) {
      setSelectedObjectList(e.itemData.collection);
    }
  };

  // 열,상수,연산자,함수 의 내용값 설명값 출력
  const handleObjectContent = (e) => {
    if (e.itemData) {
      setExplanation(e.itemData.explanation);
    }
  };

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
          dataSource={dataSource}
          displayExpr='key'
          keyExpr='key'
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
          dataSource={selectedObjectList}
          width='100%'
          height='250px'
          displayExpr='key'
          keyExpr='key'
          onItemClick={handleObjectContent}
          itemRender={(data) => {
            return (
              <div
                draggable={true}
                onDragStart={handleFromDragStart}
              >
                {data.key}
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
          value={explanation}
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
