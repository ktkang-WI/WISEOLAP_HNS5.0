import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {typeData}
  from 'components/dataset/atomic/organism/CustomData/Data/customObjectList';
import {CustomDataCalContext}
  from 'components/dataset/modal/CustomData/CustomDataCalcModal';
import {
  // Button,
  // LoadIndicator,
  SelectBox,
  TextBox} from 'devextreme-react';
import useModal from 'hooks/useModal';
import localizedString from '../../../../../../config/localization';
import {
  useContext,
  useRef
  // useState
} from 'react';
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
  const [allFields] = getContext.state.allFields;
  const textBoxRef = useRef();
  const selectBoxRef = useRef();
  // const [onLoading, setOnLoading] = useState(false);
  const {alert} = useModal();
  const [, setCheckForSaving] = getContext.state.checkForSaving;

  const inputValidation = (value) => {
    const dupplicatedNaming =
      allFields.find((item) => item.uniqueName === value);
    if (dupplicatedNaming) return true;
    return false;
  };

  const handleTextBox = (data) => {
    if (inputValidation(data.value)) {
      setCustomData((prev) => {
        return {
          ...prev,
          fieldName: ''
        };
      });
      alert('필드명이 열값과 사용자 정의 데이터와 겹칩니다. : '+data.value);
      return;
    }
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

  return (
    <>
      <Wrapper size="80%">
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
          value={customData.type}
          onValueChanged={handleSelectBox}
        />
      </Wrapper>
    </>
  );
};

export default TopBtns;
