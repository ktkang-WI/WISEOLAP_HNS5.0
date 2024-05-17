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
import {useRef} from 'react';
import models from 'models';
import useModal from 'hooks/useModal';

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

const ReportSaveModal = ({createExcelFile, ...props}) => {
  const {alert} = useModal();
  const reportOptions = useSelector(selectCurrentReport).options;
  const [dataSource, setDataSource] = useState(_.cloneDeep(reportOptions));
  const {addReport, generateParameter} = useReportSave();
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

  // 저장 팝업창 확인 버튼 클릭 시
  const onSubmit = async () => {
    const formInstance = ref.current.instance;

    if (!dataSource.reportNm?.trim()) {
      formInstance.getEditor('reportNm').focus();
      alert('보고서명을 입력해 주세요.');
    } else if (!dataSource.fldName?.trim()) {
      formInstance.getEditor('fldName').focus();
      alert('폴더를 선택해 주세요.');
    } else {
      const param = generateParameter(dataSource);
      let isOk = false;
      await models.Report.insertReport(param).then((res) => {
        if (res.status != 200) {
          alert(localizedString.faildSaveReportMsg);
          return;
        }
        const reportId = res.data.report.reportId;
        const data = res.data;
        const msg = data.msg;
        const result = data.result;


        alert(localizedString[msg]);

        if (result) {
          addReport(data);
          isOk = true;
          if (createExcelFile) createExcelFile(reportId);
        } else {
          return;
        }
      });
      return !isOk;
    }
    return true;
  };

  return (
    <Modal
      modalTitle={localizedString.saveReport}
      height={theme.size.bigModalHeight}
      width={theme.size.middleModalHeight}
      onSubmit={onSubmit}
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
