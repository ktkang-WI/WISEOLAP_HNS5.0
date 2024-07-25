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
  let value = '';

  if (id == 'defaultDisplay') {
    value = data[id]?.initDisplay || 'DashAny';
  }
  if (id == 'defaultLayout') {
    value = data[id]?.layout || 'CTGB';
  }

  if (id === 'maxReportQueryPeriod') {
    value = data[id]?.period || 2;
  }
  return (
    <SelectBox
      disabled= {!isCheck}
      width= '400px'
      // CTGB, C, G -> utility로
      items={layoutSelectList(id)}
      displayExpr='name'
      valueExpr='id'
      placeholder={value}
      value={value}
      onSelectionChanged={(e) => {
        let param = {
          check: isCheck,
          layout: e.selectedItem.id
        };

        if (id == 'defaultDisplay') {
          param = {
            displayCheck: isCheck,
            initDisplay: e.selectedItem.id
          };
        }

        if (id == 'maxReportQueryPeriod') {
          param = {
            check: isCheck,
            period: e.selectedItem.id
          };
        }

        setConfig({
          ...data,
          [id]: {...param}
        });
      }}
    />
  );
};

const checkBoxValue = (id, data) => {
  return data[id]?.check || false;
};

export const LayoutApplyCheckBox = ({id, setConfig, data}) => {
  const [isCheck, setIsCheck] = useState(() => checkBoxValue(id, data));
  return (
    <>
      <CheckBox
        text={localizedString.apply}
        hint={localizedString.myPageAdHocLayoutHint}
        value={Object.keys(data).length == 0 ? false : isCheck}
        onValueChanged={(e) => {
          setIsCheck(e.value);
          setConfig({
            ...data,
            [id]: {
              ...data[id],
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
