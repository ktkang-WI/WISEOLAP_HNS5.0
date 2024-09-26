import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {typeData}
  from 'components/dataset/atomic/organism/CustomData/Data/customObjectList';
import {CustomDataCalContext}
  from 'components/dataset/modal/CustomData/CustomDataCalcModal';
import {
  SelectBox,
  TextBox} from 'devextreme-react';
import useModal from 'hooks/useModal';
import localizedString from '../../../../../../config/localization';
import {
  useContext,
  useEffect,
  useRef
} from 'react';
import styled from 'styled-components';

const Label = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px 0 0;
`;

const TopBtns = () => {
  const getContext = useContext(CustomDataCalContext);
  const [customData, setCustomData] = getContext.state.customData;
  const [allFields] = getContext.state.allFields;
  const textBoxRef = useRef();
  const selectBoxRef = useRef();
  const {alert} = useModal();
  const [, setCheckForSaving] = getContext.state.checkForSaving;

  useEffect(() => {
    setCustomData((prev) => {
      return {
        ...prev,
        type: 'numeric'
      };
    });
  }, []);

  const inputValidation = (value) => {
    const dupplicatedNaming =
      allFields.find((item) =>
        item.uniqueName === value && item.type !== 'MEAFLD');
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
      alert(
          localizedString.customDataCalc.buttons.duplicatedFiledName+data.value
      );
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
          value={'numeric'}
          onValueChanged={handleSelectBox}
        />
      </Wrapper>
    </>
  );
};

export default TopBtns;
