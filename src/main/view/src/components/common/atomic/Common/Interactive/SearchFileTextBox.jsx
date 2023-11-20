import styled from 'styled-components';
import {getTheme} from 'config/theme';
import {TextBox} from 'devextreme-react';
import AnimatedImageButton from '../Button/AnimatedImageButton';
import colorEdit from 'assets/image/icon/button/edit_color.png';
import useModal from 'hooks/useModal';
import ReportFolderSelectorModal
  from 'components/report/organisms/Modal/ReportFolderSelectorModal';

const theme = getTheme();

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const SearchFileTextBox = ({...props}) => {
  const {openModal} = useModal();

  return (
    <Wrapper>
      <TextBox
        width={'92%'}
        height={theme.size.labelTextBoxHeight}
        readOnly={true}
        {...props}
      />
      <AnimatedImageButton
        imgSrc={colorEdit}
        width={'34px'}
        height={'34px'}
        onClick={() => openModal(ReportFolderSelectorModal)}
      />
    </Wrapper>
  );
};

export default SearchFileTextBox;
