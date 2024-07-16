import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import DataGrid, {Column} from 'devextreme-react/data-grid';
import useModal from 'hooks/useModal';
import useReportSave from 'hooks/useReportSave';
import models from 'models';
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';

const theme = getTheme();

const ReportHistoryModal = ({onClose, ...props}) => {
  const {loadReport, querySearch} = useReportSave();
  const {confirm} = useModal();
  const reportId = useSelector(selectCurrentReportId);
  const [dataSource, setDataSource] = useState([]);
  const lStr = localizedString.reportHistory;

  useEffect(() => {
    models.Log.getReportHistory(reportId).then(({data}) => {
      if (data.info != 200) return;

      const newSource = data.data.map((item, i) => ({
        index: i + 1,
        ...item
      }));

      setDataSource(newSource);
    });
  }, []);

  const openReport = (data) => {
    confirm(lStr.warning, () => {
      models.Report.getReportHistory(reportId, data.reportSeq)
          .then(({data}) => {
            try {
              loadReport(data);
              // TODO: 추후 보고서 바로 조회 적용시 수정
              querySearch();
              onClose();
            } catch (e) {
              console.error(e);
              alert(localizedString.reportCorrupted);
            }
          }).catch((e) => {
            console.error(e);
            alert(localizedString.reportCorrupted);
          });
    });
  };

  return (
    <Modal
      modalTitle={lStr.reportHistory}
      height={theme.size.middleModalHeight}
      width={theme.size.middleModalWidth}
      onClose={onClose}
      {...props}
    >
      <DataGrid
        dataSource={dataSource}
        showBorders={true}
        height={'100%'}
      >
        <Column
          width={'50px'}
          alignment='center'
          dataField='index'
          caption={lStr.index}
        />
        <Column
          dataField='modDt'
          caption={lStr.savedDate}
        />
        <Column
          alignment='center'
          width={'100px'}
          dataField='userNm'
          caption={lStr.user}
        />
        <Column
          alignment='center'
          width={'100px'}
          caption={lStr.restore}
          cellRender={({data}) => {
            return <CommonButton
              height='18px'
              type='whiteRound'
              onClick={() => openReport(data)}
            >
              {lStr.restore}
            </CommonButton>;
          }}
        />
      </DataGrid>

    </Modal>
  );
};

export default ReportHistoryModal;
