import styled from 'styled-components';
import {TextBox} from 'devextreme-react';
import AnimatedImageButton from '../Button/AnimatedImageButton';
import colorEdit from 'assets/image/icon/button/edit_color.png';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const SearchFileTextBox = ({editorOptions}) => {
  return (
    <Wrapper>
      <TextBox
        width={'92%'}
        height={editorOptions.height}
        readOnly={true}
        text={editorOptions.text}
        elementAttr={{
          id: 'searchFileText'
        }}
        onValueChanged={(e) => {
          const elementAttr = e.component.option('elementAttr');
          editorOptions.createDataSource({
            'fldNm': elementAttr.name,
            'fldId': elementAttr.fldId,
            'fldType': elementAttr.fldType
          });
        }}
      />
      <AnimatedImageButton
        imgSrc={colorEdit}
        width={'34px'}
        height={'34px'}
        onClick={editorOptions.onClick}
      />
    </Wrapper>
  );
};

export default SearchFileTextBox;
