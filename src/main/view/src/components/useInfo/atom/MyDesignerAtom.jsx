import HeaderPanel from 'components/common/atomic/Common/Panel/HeaderPanel';
import styled from 'styled-components';
import middleDot from '../../../assets/image/component/middleDot.png';
import {CheckBox, SelectBox} from 'devextreme-react';
import localizedString from 'config/localization';
import {adHocLayoutSelectList} from '../organism/MyPageUtility';

const LabelStyled = styled.span`
  display: inline-block;
  width: 300px;
`;

const Img = styled.img`
  src: ${(props) => props.src};
  vertical-align: middle;
  padding: 0px 7px 2px 5px;
`;

export const MyDesignerTitle = ({title}) => {
  return (
    <HeaderPanel width='auto'>
      {title}
    </HeaderPanel>
  );
};

export const MyDesignerLabel = ({label}) => {
  return (
    <LabelStyled>
      <Img src={middleDot}/>
      {label}
    </LabelStyled>
  );
};

export const LayoutSelectBox = ({isCheck, setConfig, data}) => {
  return (
    <SelectBox
      disabled= {!isCheck}
      width= '400px'
      // CTGB, C, G -> utility로
      items={adHocLayoutSelectList()}
      displayExpr='name'
      valueExpr='id'
      value={data.defaultLayout?.layout || 'CTGB'}
      onSelectionChanged={(e) => {
        setConfig({
          ...data,
          'defaultLayout': {
            check: isCheck,
            layout: e.selectedItem.id
          }
        });
      }}
    />
  );
};

export const LayoutApplyCheckBox = ({isCheck, setIsCheck, setConfig, data}) => {
  return (
    <CheckBox
      text={localizedString.apply}
      hint={localizedString.myPageAdHocLayoutHint}
      value={isCheck}
      onValueChanged={(e) => {
        setIsCheck(e.value);
        setConfig({...data,
          'defaultLayout': {
            ...data.defaultLayout,
            check: e.value
          }
        });
      }}
    />
  );
};
