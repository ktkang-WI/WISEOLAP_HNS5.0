import PageWrapper from 'components/common/atomic/Modal/atoms/PageWrapper';
import Alert from 'components/common/atomic/Modal/organisms/Alert';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import DesignerReportTabs
  from 'components/common/atomic/ReportTab/organism/DesignerReportTabs';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import useModal from 'hooks/useModal';
import {useEffect, useState} from 'react';
import models from 'models';
import {setIconReportList} from 'components/report/util/ReportUtility';
import ReportSlice from 'redux/modules/ReportSlice';
import ItemSlice from 'redux/modules/ItemSlice';
import LayoutSlice from 'redux/modules/LayoutSlice';
import DatasetSlice from 'redux/modules/DatasetSlice';
import {useDispatch} from 'react-redux';
import {makeMart} from 'components/report/item/util/martUtilityFactory';
import meaImg from 'assets/image/icon/dataSource/measure.png';
import dimImg from 'assets/image/icon/dataSource/dimension.png';
import folderImg from 'assets/image/icon/report/folder_load.png';
import useQueryExecute from 'hooks/useQueryExecute';
import ParameterSlice from 'redux/modules/ParameterSlice';
import ItemManager from 'components/report/item/util/ItemManager';

const theme = getTheme();

const LoadReportModal = ({...props}) => {
  let selectedReport = {};
  const [reportList, setReportList] = useState();
  const {openModal} = useModal();
  const dispatch = useDispatch();

  const {setReports, selectReport} = ReportSlice.actions;
  const {setItems} = ItemSlice.actions;
  const {setLayout} = LayoutSlice.actions;
  const {setDataset} = DatasetSlice.actions;
  const {setParameterInformation} = ParameterSlice.actions;
  const {executeItems} = useQueryExecute();

  useEffect(() => {
    models.Report.getList('admin', 'DashAny', 'designer').then((data) => {
      setIconReportList(data.privateReport);
      setIconReportList(data.publicReport);
      setReportList(data);
    });
  }, []);

  return (
    <Modal
      onSubmit={() => {
        if (!_.isEmpty(selectedReport)) {
          if (selectedReport.type == 'REPORT') {
            models.Report.getReportById('admin', selectedReport.id)
                .then((data) => {
                  dispatch(setLayout({
                    reportId: selectedReport.id,
                    layout: data.layout
                  }));
                  dispatch(selectReport(selectedReport.id));
                  dispatch(setReports(data.reports));
                  data.item.items.forEach((i) => {
                    i.mart = makeMart(i);
                    ItemManager.generateMeta(i);
                  });
                  dispatch(setItems({
                    reportId: selectedReport.id,
                    items: data.item
                  }));
                  data.dataset.datasets.forEach((i) => {
                    i.fields = i.fields.map((field) => {
                      const isMea = field.columnTypeName == 'decimal';
                      return {
                        icon: isMea ? meaImg : dimImg,
                        parentId: '0',
                        uniqueName: field.columnName,
                        name: field.columnName,
                        type: isMea ? 'MEA' : 'DIM',
                        ...field
                      };
                    });
                    i.fields.unshift({
                      name: localizedString.defaultDatasetName,
                      type: 'FLD',
                      uniqueName: '0',
                      icon: folderImg
                    });
                  });
                  dispatch(setDataset({
                    reportId: selectedReport.id,
                    dataset: data.dataset
                  }));
                  dispatch(setParameterInformation({
                    reportId: selectedReport.id,
                    informations: data.informations
                  }));
                  executeItems();
                });
          } else {
            openModal(Alert, {
              message: '선택한 항목이 보고서가 아닙니다.'
            });
            return true;
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
        <DesignerReportTabs
          reportList={reportList}
          onSelectionChanged={(e) => {
            const nodes = e.component.getSelectedNodes();

            if (nodes.length > 0) {
              selectedReport = nodes[0].itemData;
            } else {
              selectedReport = {};
            }
          }}/>
      </PageWrapper>
    </Modal>
  );
};

export default LoadReportModal;
