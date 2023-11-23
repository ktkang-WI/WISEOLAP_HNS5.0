import {getTheme} from 'config/theme';
import localizedString from 'config/localization';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import ReportSaveForm from 'components/report/molecules/ReportSaveForm';
import styled from 'styled-components';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import {useSelector} from 'react-redux';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
import {useState} from 'react';
import useReportSave from 'hooks/useReportSave';

const theme = getTheme();

const StyledModalPanel = styled(ModalPanel)`
    .dx-field-item-label {
      width: 100%;
      display: block;
      font: ${theme.font.modalTitle};
      color: ${theme.color.primary};
      margin-bottom: 5px;
    }
    .dx-field-item-custom-label-content {
      display: block;
      border-bottom: solid 1px ${theme.color.breakLine};
      padding-bottom: 5px;
    }
    .dx-item-content {
      padding: 10px;
    }
  `;

const SaveReportModal = ({...props}) => {
  const reportOptions = useSelector(selectCurrentReport).options;
  const [dataSource, setDataSource] = useState(_.cloneDeep(reportOptions));
  const {saveReport} = useReportSave();

  /**
   * SaveReportModal state(dataSource) 값 설정
   * ReportSaveForm.jsx , searchFileTextBox.jsx 에서 현재 파일의 state를 변경하기 위함
   * (key 값은 Form item 의 dataField 값과 일치)
   * @param {JSON} param  dataSource 의 key, value 값
   */
  const createDataSource = (param) => {
    setDataSource((dataSource) => ({...dataSource, ...param}));
  };

  return (
    <Modal
      modalTitle={localizedString.saveReport}
      height={theme.size.bigModalHeight}
      width={theme.size.middleModalHeight}
      onSubmit={(e) => {
        // generateParameter(dataSource);
        saveReport(dataSource);
      }}
      {...props}
    >
      <StyledModalPanel title={localizedString.saveReport}>
        <ReportSaveForm
          dataSource={dataSource}
          createDataSource={createDataSource}
        />
      </StyledModalPanel>
    </Modal>
  );
};

export default SaveReportModal;
