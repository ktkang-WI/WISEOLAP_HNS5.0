import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {typeData}
  from 'components/dataset/atomic/organism/CustomData/Data/customObjectList';
import {CustomDataCalContext}
  from 'components/dataset/modal/CustomData/CustomDataCalcModal';
import {Button, LoadIndicator, SelectBox, TextBox} from 'devextreme-react';
import useModal from 'hooks/useModal';
import localizedString from '../../../../../../config/localization';
import {useContext, useRef, useState} from 'react';
import styled from 'styled-components';

const Label = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px 0 0;
`;

// 사용자 정의 데이터 계산식 상단 버튼 부분
const TopBtns = () => {
  const getContext = useContext(CustomDataCalContext);
  const [customData, setCustomData] = getContext.state.customData;
  const textBoxRef = useRef();
  const selectBoxRef = useRef();
  const [onLoading, setOnLoading] = useState(false);
  const {alert} = useModal();
  const [checkForSaving, setCheckForSaving] = getContext.state.checkForSaving;

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
      if (!checkForSaving.type) alert(localizedString.common.invalid);
    }, 1000);
  };

  return (
    <>
      <Wrapper size="65%">
        <Wrapper display='flex' flex-direction='row'>
          <Wrapper size="40%" display='flex' flex-direction='row'>
            <Label htmlFor="fieldName">
              {localizedString.customData.list.fieldName}
            </Label>
            <TextBox
              name='fieldName'
              maxLength={20}
              ref={textBoxRef}
              value={customData.fieldName}
              onValueChanged={handleTextBox}
            />
          </Wrapper>
        </Wrapper>
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
          <span className="dx-button-text">
            {localizedString.customDataCalc.butons.Inspection}
          </span>
        </Button>
      </Wrapper>
    </>
  );
};

export default TopBtns;
