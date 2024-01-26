import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {dataSource}
  from 'components/dataset/atomic/organism/CustomData/Data/customObjectList';
import {List, TextArea} from 'devextreme-react';
import _ from 'lodash';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  selectCurrentDataField
} from 'redux/selector/ItemSelector';


const ListStyled = {
  width: '100%',
  height: '250px',
  border: '1px dashed darkgray',
  borderRadius: '8px',
  padding: '10px'
};

const TextAreaStyled = {
  width: '100%',
  height: '100%'
};

// 사용자 정의 데이터 객체 정보 및 설명
const CalcObjectList = () => {
  // UseState
  const [selectedObjectList, setSelectedObjectList] = useState();
  const [explanation, setExplanation] = useState('');

  // Selector
  const selectedCurrentDataField = useSelector(selectCurrentDataField);
  // 초기화
  useEffect(() => {
    initColumns();
  }, []);

  const removeDuplicateValue = (func, array, returnArray, prevKey) => {
    try {
      if (array.length == 0) return returnArray;
      const measure = array.shift();
      const key = func(measure);
      let isInsertingData = false;
      // 키를 생성해야함
      if (!prevKey) {
        isInsertingData = true;
      } else {
        prevKey === key ?
        isInsertingData = false : isInsertingData = true;
      };
      if (isInsertingData) returnArray.push(measure);
      return removeDuplicateValue(func, array, returnArray, key);
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const locatedFields = (selectedCurrentDataField) => {
    let tempMeasures = selectedCurrentDataField.measure;
    let measures = [];

    if (!tempMeasures) {
      tempMeasures =
      selectedCurrentDataField.field.filter((item) => item.fieldType === 'MEA');
    }
    measures = removeDuplicateValue(
        (measure) => {
          return measure.summaryType + '_' + measure.name;
        },
        _.cloneDeep(tempMeasures),
        measures);

    const isMeasureEmpty = measures.length === 0;
    let isSelectedMeasureFieldsEmpty = true;
    let selectedMeasureFields = null;

    if (isMeasureEmpty) return null;

    selectedMeasureFields =
      measures.filter((item) => item.expression == null)
          .map((item) => {
            return {
              key: item.name,
              explanation: item.type === 'DIM' ? 'varchar2' : 'decimal'
            };
          });

    isSelectedMeasureFieldsEmpty = selectedMeasureFields.length == 0;
    if (isSelectedMeasureFieldsEmpty) return null;

    return selectedMeasureFields;
  };

  const initColumns = () => {
    const fields = locatedFields(selectedCurrentDataField);

    if (!fields) return;
    // Get dataItems
    const dataItems = fields.map((item) => {
      return {
        key: `[${item.key}]`,
        explanation: item.explanation
      };
    });

    dataSource[0].collection = dataItems;
  };

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
          style={ListStyled}
          dataSource={dataSource}
          displayExpr='key'
          keyExpr='key'
          onItemClick={handleObject}>
        </List>
      </Wrapper>
      <Wrapper>
        <List
          // TODO: 스타일 위치 변경해야함. 회의 필요. ? Styled-componentd? 위치는?
          style={ListStyled}
          dataSource={selectedObjectList}
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
          style={TextAreaStyled}
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
