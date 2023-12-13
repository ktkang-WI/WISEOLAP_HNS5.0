import {getTheme} from 'config/theme';
import localizedString from 'config/localization';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import ReportSaveForm from '../atomic/Save/molecules/ReportSaveForm';
import styled from 'styled-components';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import {useSelector} from 'react-redux';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
import {useState} from 'react';
import useReportSave from 'hooks/useReportSave';
import useModal from 'hooks/useModal';
import {useRef} from 'react';

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

const ReportSaveModal = ({...props}) => {
  const {alert} = useModal();
  const reportOptions = useSelector(selectCurrentReport).options;
  const [dataSource, setDataSource] = useState(_.cloneDeep(reportOptions));
  const {saveReport} = useReportSave();
  const ref = useRef();
  /**
   * SaveReportModal state(dataSource) 값 설정
   * ReportSaveForm.jsx 현재 파일의 state를 변경하기 위함
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
        const formInstance = ref.current.instance;

        if (!dataSource.reportNm?.trim()) {
          formInstance.getEditor('reportNm').focus();
          alert('보고서명을 입력해 주세요.');
        } else if (!dataSource.fldName?.trim()) {
          formInstance.getEditor('fldName').focus();
          alert('폴더를 선택해 주세요.');
        } else {
          // 팝업창 으로 저장 할 경우 (새로 저장 or 다른이름으로 저장)에는
          // reportId 를 0 으로 하여 무조건 insert 하게 한다.
          dataSource.reportId = 0;
          saveReport(dataSource);
          return;
        }

        return true;
      }}
      {...props}
    >
      <StyledModalPanel title={localizedString.saveReport}>
        <ReportSaveForm
          dataSource={dataSource}
          createDataSource={createDataSource}
          formRef={ref}
        />
      </StyledModalPanel>
    </Modal>
  );
};

export default ReportSaveModal;
