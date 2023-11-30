import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import SmallImageButton
  from 'components/common/atomic/Common/Button/SmallImageButton';
import editImage from 'assets/image/icon/button/modify.png';
import useModal from 'hooks/useModal';
import SimpleInputModal
  from 'components/common/atomic/Modal/organisms/SimpleInputModal';
import localizedString from 'config/localization';

const theme = getTheme();

const StyledWrapper = styled.div`
  font: ${theme.font.modalFirstTitle};
  color: ${theme.color.primaryFont};
  padding: 5px 10px;
  box-sizing: border-box;
`;

const DatasetName = ({
  onValueChanged,
  name=localizedString.defaultDatasetName
}) => {
  const {openModal} = useModal();
  return (
    <StyledWrapper>
      <span style={{float: 'left', padding: '2.5px 0px'}}>{name}</span>
      <SmallImageButton
        onClick={() => {
          openModal(SimpleInputModal, {
            modalTitle: localizedString.editDatasetName,
            label: localizedString.datasetName,
            defaultValue: name,
            onSubmit: (title) => {
              onValueChanged(title);
            }
          });
        }}
        src={editImage}/>
    </StyledWrapper>
  );
};

export default DatasetName;
