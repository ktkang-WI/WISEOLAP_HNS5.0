import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {typeData}
  from 'components/dataset/atomic/organism/CustomData/Data/customObjectList';
import {CustomDataCalContext}
  from 'components/dataset/modal/CustomData/CustomDataCalcModal';
import {Button, LoadIndicator, SelectBox, TextBox} from 'devextreme-react';
import useModal from 'hooks/useModal';
import {useContext, useRef, useState} from 'react';

/* 사용자 정의 데이터 계산식 상단 버튼 부분
@Autor : KIM JAE HYEON
@Date : 20231215 */
const TopBtns = ({...props}) => {
  // #################################### 변수 선언 시작
  const getContext = useContext(CustomDataCalContext);
  const [customData, setCustomData] = getContext.state.customData;
  const textBoxRef = useRef();
  const selectBoxRef = useRef();
  const [onLoading, setOnLoading] = useState(false);
  const {alert} = useModal();
  const [checkForSaving, setCheckForSaving] = getContext.state.checkForSaving;
  // #################################### 변수 선언 종료
  // #################################### 함수 시작
  const handleTextBox = (data) => {
    setCustomData((prev) => {
      return {
        ...prev,
        fieldName: data.value
      };
    });
  };
  const handleSelectBox = (data) => {
    setCustomData((prev) => {
      return {
        ...prev,
        type: data.value
      };
    });
    setCheckForSaving((prev)=>{
      return {
        ...prev,
        type: true
      };
    });
  };
  // 테스트용 코드 기능 미구현
  const handleLoading = () => {
    setOnLoading(true);
    setTimeout(() => {
      setOnLoading(false);
      setCheckForSaving((prev)=>{
        return {
          ...prev,
          inspection: checkForSaving.type
        };
      });
      if (!checkForSaving.type) alert('유효하지않습니다.');
    }, 1000);
  };
  // #################################### 함수 종료
  return (
    <>
      <Wrapper size="65%">
        <TextBox maxLength={20}
          ref={textBoxRef}
          value={customData.fieldName}
          onValueChanged={handleTextBox}
        />
      </Wrapper>
      <Wrapper size="20%">
        <SelectBox
          ref={selectBoxRef}
          dataSource={typeData}
          valueExpr="id"
          displayExpr="text"
          onValueChanged={handleSelectBox}
        />
      </Wrapper>
      <Wrapper size="15%">
        <Button
          id="button"
          width='100%'
          type={checkForSaving.inspection ? 'success':''}
          height={35}
          onClick={handleLoading}
        >
          <LoadIndicator className="button-indicator"
            visible={onLoading} />
          <span className="dx-button-text">검사</span>
        </Button>
      </Wrapper>
    </>
  );
};

export default TopBtns;
