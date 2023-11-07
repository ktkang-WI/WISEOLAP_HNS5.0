import PageWrapper from 'components/common/atomic/Modal/atoms/PageWrapper';
import Alert from 'components/common/atomic/Modal/organisms/Alert';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import DesignerReportTabs
  from 'components/common/atomic/ReportTab/organism/DesignerReportTabs';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import useModal from 'hooks/useModal';
import {useEffect, useState} from 'react';
// import models from 'models';

const theme = getTheme();

const LoadReportModal = ({...props}) => {
  const [selectedReport, setSelectedReport] = useState({});
  const {openModal} = useModal();


  useEffect(() => {
    // TODO: 추후 접속중인 유저 ID로 변경
    // models.Report.getById(userId)
    //     .then((data) => {
    //       setDsViewList(data);
    //     });
  }, []);

  return (
    <Modal
      onSubmit={() => {
        if (!_.isEmpty(selectedReport)) {
          if (selectedReport.expanded) {
            openModal(Alert, {
              message: '선택한 항목이 보고서가 아닙니다.'
            });
            return true;
          } else {
            // models.Report.getById(userId, )
            //   .then((data) => {
            // });
          }
        } else {
          openModal(Alert, {
            message: '보고서를 선택하지 않았습니다.'
          });
          return true;
        }
      }}
      modalTitle={localizedString.loadReport}
      height={theme.size.middleModalHeight}
      width={theme.size.smallModalWidth}
      {...props}
    >
      <PageWrapper>
        <DesignerReportTabs onSelectionChanged={(e) => {
          const nodes = e.component.getSelectedNodes();

          if (nodes.length > 0) {
            setSelectedReport(nodes[0].itemData);
          } else {
            setSelectedReport({});
          }
        }}/>
      </PageWrapper>
    </Modal>
  );
};

export default LoadReportModal;
