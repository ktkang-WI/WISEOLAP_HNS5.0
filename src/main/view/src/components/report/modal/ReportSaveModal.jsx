import {getTheme} from 'config/theme';
import localizedString from 'config/localization';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import ReportSaveForm from '../atomic/Save/molecules/ReportSaveForm';
import {useSelector} from 'react-redux';
import {selectCurrentReport} from 'redux/selector/ReportSelector';
import {useState} from 'react';
import useReportSave from 'hooks/useReportSave';
import {useRef} from 'react';
import models from 'models';
import useModal from 'hooks/useModal';
import {selectCurrentDatasets} from 'redux/selector/DatasetSelector';
import DatasetType from 'components/dataset/utils/DatasetType';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import {selectLinkedReport} from 'redux/selector/LinkSelector';
import useLinkReportSave from 'hooks/useLinkReportSave';

const theme = getTheme();

const ReportSaveModal = ({createExcelFile, ...props}) => {
  const {alert} = useModal();
  const reportOptions = useSelector(selectCurrentReport).options;
  const newReportOptions = {
    ...reportOptions,
    promptYn: reportOptions.promptYn === 'Y',
    maxReportPeriodYn: reportOptions.maxReportPeriodYn === 'Y'
  };
  const datasets = useSelector(selectCurrentDatasets);
  const isCube = datasets
      .filter((dataset) => dataset.datasetType === DatasetType['CUBE'])
      .length > 0;
  const designerMode = useSelector(selectCurrentDesignerMode);
  const [dataSource, setDataSource] = useState(_.cloneDeep(newReportOptions));
  const {addReport, generateParameter} = useReportSave();
  const ref = useRef();
  const selectLinkedReportList = useSelector(selectLinkedReport);
  const {genLinkParam} = useLinkReportSave();

  /**
   * SaveReportModal state(dataSource) 값 설정
   * ReportSaveForm.jsx 현재 파일의 state를 변경하기 위함
   * (key 값은 Form item 의 dataField 값과 일치)
   * @param {JSON} param  dataSource 의 key, value 값
   */
  const createDataSource = (param) => {
    setDataSource((prevDataSource) => ({...prevDataSource, ...param}));
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
      let reportId = 0;
      let reportNm;
      await models.Report.insertReport(param).then((res) => {
        if (res.status != 200) {
          alert(localizedString.faildSaveReportMsg);
          return;
        }
        reportId = res.data.report.reportId;
        reportNm = res.data.report.reportNm;
        const data = res.data;
        const msg = data.msg;
        const result = data.result;
        if (result) {
          addReport(data);
          isOk = true;
          if (createExcelFile) {
            createExcelFile(reportId);
          } else {
            alert(localizedString[msg]);
          }
        } else {
          return;
        }
      }).catch((e) => {
        console.log(e);
      });
      if (Object.keys(selectLinkedReportList).length > 0) {
        for (const key in selectLinkedReportList) {
          if (selectLinkedReportList.hasOwnProperty(key)) {
            selectLinkedReportList[key].reportId = reportId;
            selectLinkedReportList[key].reportNm = reportNm;
          }
        }
      }
      const linkParam = genLinkParam(selectLinkedReportList);
      models.Report.insertLinkReport(linkParam.data).then((res) => {
      }).catch((e) => {
        console.log(e);
      });
      return !isOk;
    }
    return true;
  };

  return (
    <Modal
      modalTitle={localizedString.saveReport}
      height={theme.size.bigModalHeight}
      width={theme.size.smallModalWidth}
      onSubmit={onSubmit}
      {...props}
    >
      <ReportSaveForm
        dataSource={dataSource}
        createDataSource={createDataSource}
        formRef={ref}
        isCube={isCube}
        designerMode={designerMode}
      />
    </Modal>
  );
};

export default ReportSaveModal;
