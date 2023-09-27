import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import SmallImageButton
  from 'components/common/atomic/Common/Button/SmallImageButton';
import editImage from 'assets/image/icon/button/modify.png';
import useModal from 'hooks/useModal';
import SimpleInputModal
  from 'components/common/atomic/Modal/organisms/SimpleInputModal';

const theme = getTheme();

const StyledWrapper = styled.div`
  font: ${theme.font.modalFirstTitle};
  color: ${theme.color.primaryFont};
  padding: 5px 10px;
  box-sizing: border-box;
`;

const DatasetName = ({onChangedValue, name='데이터 집합'}) => {
  const {openModal} = useModal();
  return (
    <StyledWrapper>
      <span style={{float: 'left', padding: '2.5px 0px'}}>{name}</span>
      <SmallImageButton
        onClick={() => {
          openModal(SimpleInputModal, {
            modalTitle: '데이터 집합 명 수정',
            label: '데이터 집합 명',
            defaultValue: name,
            onSubmit: (title) => {
              onChangedValue(title);
            }
          });
        }}
        src={editImage}/>
    </StyledWrapper>
  );
};

export default DatasetName;
