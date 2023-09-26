import {getTheme} from 'config/theme';
import {styled, css} from 'styled-components';
import Modal from './Modal';
import localizedString from '../../../../../config/localization';
import ModalPanel from '../molecules/ModalPanel';
import Wrapper from '../../Common/Wrap/Wrapper';

const theme = getTheme();

const padding = 5;

const StyledWrapper = styled(Wrapper)`
  display: flex;
  ${(props) => props.direction == 'row' ? css`
    flex-direction: row;
  ` : css`
    flex-direction: column;
  `}
  height: ${(props) => props.height || '100%'};
  width: ${(props) => props.width || '100%'};
  padding: ${(props) => props.padding || '0'}px;
`;

const SelectCubeModal = ({...props}) => {
  return (
    <Modal
      onSubmit={()=> {}}
      page={1}
      usePage
      modalTitle={localizedString.selectCube}
      height={theme.size.middleModalHeight}
      width={theme.size.middleModalWidth}
      {...props}
    >
      <StyledWrapper direction="row">
        <StyledWrapper width='50%' padding={padding}>
          <ModalPanel
            title={localizedString.dataSourceList}
          >
          </ModalPanel>
        </StyledWrapper>
        <StyledWrapper width='50%' padding={padding}>
          <ModalPanel height={'60%'} title={localizedString.cubeList}/>
          <ModalPanel height={'40%'} title={localizedString.cubeComment}/>
        </StyledWrapper>
      </StyledWrapper>
    </Modal>
  );
};

export default SelectCubeModal;
