import HeaderPanel from 'components/common/atomic/Common/Panel/HeaderPanel';
import styled from 'styled-components';
import middleDot from '../../../assets/image/component/middleDot.png';
import {CheckBox, SelectBox, TextBox} from 'devextreme-react';
import localizedString from 'config/localization';
import {layoutSelectList}
  from '../organism/myDesigner/MypageDesignerUtil';
import {useState} from 'react';

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

export const MyPageTextBox = ({value}) => {
  return (
    <TextBox
      className='favoritTextBox'
      readOnly={true}
      width= '400px'
      value={value}
    />
  );
};

const LayoutSelectBox = ({id, isCheck, setConfig, data}) => {
  return (
    <SelectBox
      disabled= {!isCheck}
      width= '400px'
      // CTGB, C, G -> utility로
      items={layoutSelectList(id)}
      displayExpr='name'
      valueExpr='id'
      value={data[id]?.layout}
      onSelectionChanged={(e) => {
        setConfig({
          ...data,
          [id]: {
            check: isCheck,
            layout: e.selectedItem.id
          }
        });
      }}
    />
  );
};

export const LayoutApplyCheckBox = ({id, setConfig, data}) => {
  const [isCheck, setIsCheck] = useState(
    data.defaultLayout ? data.defaultLayout.check : false
  );
  return (
    <>
      <CheckBox
        text={localizedString.apply}
        hint={localizedString.myPageAdHocLayoutHint}
        value={isCheck}
        onValueChanged={(e) => {
          setIsCheck(e.value);
          setConfig({...data,
            [id]: {
              ...data.defaultLayout,
              check: e.value
            }
          });
        }}
      />
      <LayoutSelectBox
        id={id}
        isCheck={isCheck}
        data={data}
        setConfig={setConfig}
      />
    </>
  );
};
