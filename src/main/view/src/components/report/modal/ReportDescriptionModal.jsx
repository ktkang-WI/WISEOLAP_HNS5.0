
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import {useSelector} from 'react-redux';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
import {styled} from 'styled-components';

const theme = getTheme();

const ContentWrapper = styled.div`
  border: ${theme.color.breakLine} 1px solid;
  border-radius: 10px;
  padding: 5px 7px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  font: ${theme.font.common};
`;

const ReportDescriptionModal = ({dataField = {}, ...props}) => {
  const report = useSelector(selectCurrentReport);

  const target = ['measure', 'row', 'column'];

  const fieldMsg = target.reduce((msg, key) => {
    if (dataField[key] && dataField[key].length > 0) {
      msg += localizedString[key] + ': ';
      msg += dataField[key].map((({caption}) => caption)).join(', ');
      msg += '\n';
    }

    return msg;
  }, '');

  return (
    <Modal
      modalTitle={localizedString.reportDescription}
      height={theme.size.bingModal}
      width={theme.size.middleModalHeight}
      {...props}
    >
      <Wrapper
        display='flex'
        direction='column'
      >
        <ModalPanel
          padding='5'
          style={{
            height: '50%'
          }}
          title={report?.options?.reportNm}
        >
          <ContentWrapper className='custom-scrollbar'>
            {report?.options?.reportDesc}
          </ContentWrapper>
        </ModalPanel>
        <ModalPanel
          padding='5'
          style={{
            height: '50%'
          }}
          title={localizedString.dataItem}
        >
          <ContentWrapper className='custom-scrollbar'>
            {fieldMsg}
          </ContentWrapper>
        </ModalPanel>
      </Wrapper>
    </Modal>
  );
};

export default ReportDescriptionModal;
