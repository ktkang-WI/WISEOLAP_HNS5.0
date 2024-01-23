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
import {useDispatch} from 'react-redux';
import {makeMart} from 'components/report/item/util/martUtilityFactory';
import meaImg from 'assets/image/icon/dataSource/measure.png';
import dimImg from 'assets/image/icon/dataSource/dimension.png';
import folderImg from 'assets/image/icon/report/folder_load.png';
import ParameterSlice from 'redux/modules/ParameterSlice';
import ItemManager from 'components/report/item/util/ItemManager';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import store from 'redux/modules';
import {DesignerMode} from 'components/config/configType';
import DatasetSlice from 'redux/modules/DatasetSlice';
import ribbonDefaultElement
  from 'components/common/atomic/Ribbon/organism/RibbonDefaultElement';
import spreadDefaultElement from
  'components/report/atomic/spreadBoard/organisms/SpreadDefaultElement';
import {selectSheets} from 'redux/selector/SpreadSelector';
import SpreadSlice from 'redux/modules/SpreadSlice';
import useSpread from 'hooks/useSpread';

const theme = getTheme();

const LoadReportModal = ({...props}) => {
  let selectedReport = {};
  const [reportList, setReportList] = useState();
  const {openModal, alert} = useModal();
  const dispatch = useDispatch();
  const {setDataset} = DatasetSlice.actions;
  const {setReports, selectReport} = ReportSlice.actions;
  const {setItem} = ItemSlice.actions;
  const {setLayout} = LayoutSlice.actions;
  const {setParameterInformation} = ParameterSlice.actions;
  const ribbonElement = ribbonDefaultElement();
  const {setRibbonSetting} = spreadDefaultElement();
  const {setSpread} = SpreadSlice.actions;
  const {sheetNameChangedListener,
    sheetChangedListener} = useSpread();

  useEffect(() => {
    const reportType = selectCurrentDesignerMode(store.getState());
    models.Report.getList('admin', reportType, 'designer').then(({data}) => {
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
                .then(({data}) => {
                  try {
                    const reportType =
                        selectCurrentDesignerMode(store.getState());
                    dispatch(setReports(data.reports));
                    dispatch(selectReport(selectedReport.id));
                    data.item.items.forEach((i) => {
                      i.mart = makeMart(i);
                      ItemManager.generateMeta(i);
                    });
                    // const selectedDatasetId = data.dataset.selectedDatasetId;
                    data.dataset.datasets.forEach((i) => {
                      i.fields = i.fields.map((field) => {
                        const isMea = field.columnTypeName == 'decimal';
                        if (field.uniqueName != 0) {
                          return {
                            icon: isMea ? meaImg : dimImg,
                            parentId: '0',
                            uniqueName: field.columnName,
                            name: field.columnName,
                            type: isMea ? 'MEA' : 'DIM',
                            ...field
                          };
                        } else return;
                      }).filter(Boolean);
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
                    // let selectedItemId = null;
                    // for (const item of data.item.items) {
                    //   if (item.meta?.dataField?.datasetId ===
                    //       selectedDatasetId) {
                    //     selectedItemId = item.id;
                    //     break;
                    //   }
                    // }
                    dispatch(setLayout({
                      reportId: selectedReport.id,
                      layout: data.layout
                    }));
                    dispatch(setItem({
                      reportId: selectedReport.id,
                      item: data.item
                    }));
                    dispatch(setParameterInformation({
                      reportId: selectedReport.id,
                      informations: data.informations
                    }));
                    if (reportType === DesignerMode.SPREAD_SHEET) {
                      const sheets = selectSheets(store.getState());
                      const config = setRibbonSetting();
                      const designer =
                      new sheets.Designer
                          .Designer(document.getElementById('spreadWrapper'),
                              config);
                      dispatch(setSpread({
                        reportId: selectedReport.id,
                        bindingInfos: data.spread,
                        designer: designer
                      }));
                      sheetNameChangedListener();
                      sheetChangedListener();
                    }
                    ribbonElement['QuerySearch'].onClick();
                  } catch {
                    alert(localizedString.reportCorrupted);
                  }
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
