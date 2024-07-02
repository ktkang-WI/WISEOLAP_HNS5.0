import Modal from '../../../Modal/organisms/Modal';
import {createContext, useEffect, useState} from 'react';
import {dataSource} from './metaData/SeriesOptionData';
import {
  seriesOptionFetch}
  from 'redux/modules/SeriesOption/SeriesOptionSlice';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {getSeriesOptionFetchFormat}
  from 'redux/modules/SeriesOption/SeriesOptionFormat';
import {selectSeriesOption}
  from 'redux/selector/SeriesOption/SeriesOptionSelector';
import localizedString from 'config/localization';
import styled from 'styled-components';
import CommonTab from 'components/common/atomic/Common/Interactive/CommonTab';
import {selectCurrentItemType} from 'redux/selector/ItemSelector';
import store from 'redux/modules';
import ItemType from 'components/report/item/util/ItemType';

export const DataColumnSeriesOptionsContext = createContext();

const OverFlowScrollSetting = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const TabPanelItem = ({children}) => {
  return (
    <OverFlowScrollSetting id ='TEST'>{children}</OverFlowScrollSetting>
  );
};

const DataColumnSeriesOptions = (
    {fieldId, onClose, parameterInfo, onSubmit}) => {
  // selectors
  const currentReportId = useSelector(selectCurrentReportId);
  const seriesOptions = useSelector(selectSeriesOption);
  const itemType = selectCurrentItemType(store.getState());

  // useState
  const [tabPanelItem, setTabPanelItem] =
   useState(
    itemType === ItemType.RANGE_BAR ?
      dataSource[2].component :
      dataSource[0].component
   );

  const dispatch = useDispatch();

  // TODO: Get Data from Redux
  const [type, setType] = useState('');
  const [general, setGeneral] = useState({});
  const [pointLabel, setPointLabel] = useState({});

  useEffect(() => {
    effectSeriesOption();
  }, []);

  const effectSeriesOption = () => {
    if (!seriesOptions) return;
    if (!seriesOptions.length == 0) {
      const seriesOption =
        seriesOptions.find((item) => item.fieldId === fieldId);
      setType(seriesOption.type);
      setGeneral(seriesOption.general);
      setPointLabel(seriesOption.pointLabel);
    }
  };

  // setting context
  const context = {
    state: {
      type: [type, setType],
      general: [general, setGeneral],
      pointLabel: [pointLabel, setPointLabel]
    }
  };

  const handleTabPanelItem = (e) => {
    const panelTitle = e.itemData.title;
    dataSource.forEach((item) => {
      if (item.title === panelTitle) {
        setTabPanelItem(item.component);
        return;
      }
    });
  };

  const handleSeriesOptionFetch = () => {
    const tempSeriesOption = getSeriesOptionFetchFormat();
    tempSeriesOption.reportId = currentReportId;
    tempSeriesOption.fieldId = fieldId;
    tempSeriesOption.seriesOptions.general = general;
    tempSeriesOption.seriesOptions.type = type;
    tempSeriesOption.seriesOptions.pointLabel = pointLabel;
    dispatch(seriesOptionFetch(tempSeriesOption));
  };

  return (
    <DataColumnSeriesOptionsContext.Provider
      value={context}
    >
      <Modal
        onSubmit={() => {
          handleSeriesOptionFetch();
        }}
        height='700px'
        width='500px'
        modalTitle={localizedString.seriesOptions.title}
        onClose={onClose}>
        <CommonTab
          className='dx-theme-background-color'
          width='100%'
          height='100%'
          dataSource={
            itemType === ItemType.RANGE_BAR ? [dataSource[2]] : dataSource}
          animationEnabled={false}
          swipeEnabled={false}
          onTitleClick={(e) => {
            handleTabPanelItem(e);
          }}
          itemComponent={() => {
            return <TabPanelItem>{tabPanelItem}</TabPanelItem>;
          }}
        >

        </CommonTab>
      </Modal>
    </DataColumnSeriesOptionsContext.Provider>
  );
};

export default DataColumnSeriesOptions;
