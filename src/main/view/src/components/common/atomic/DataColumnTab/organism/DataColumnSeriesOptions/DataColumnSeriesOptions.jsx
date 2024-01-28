import {TabPanel} from 'devextreme-react';
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

export const DataColumnSeriesOptionsContext = createContext();

const TabPanelItem = ({children}) => {
  return (
    <>{children}</>
  );
};

const DataColumnSeriesOptions = (
    {fieldId, onClose, parameterInfo, onSubmit}) => {
  // useState
  const [tabPanelItem, setTabPanelItem] = useState(dataSource[0].component);
  const dispatch = useDispatch();

  // TODO: Get Data from Redux
  const [type, setType] = useState('');
  const [general, setGeneral] = useState({});
  const [pointLabel, setPointLabel] = useState({});

  const currentReportId = useSelector(selectCurrentReportId);
  const seriesOptions = useSelector(selectSeriesOption);

  useEffect(() => {
    if (!seriesOptions || !seriesOptions.length == 0) {
      const seriesOption =
      seriesOptions.filter((item) => item.fieldId === fieldId)[0];
      setType(seriesOption.type);
      setGeneral(seriesOption.general);
      setPointLabel(seriesOption.pointLabel);
    }
  }, []);

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
        <TabPanel
          className='dx-theme-background-color'
          width='100%'
          height='100%'
          dataSource={dataSource}
          animationEnabled={false}
          swipeEnabled={false}
          onTitleClick={(e) => {
            handleTabPanelItem(e);
          }}
          itemComponent={() => {
            return <TabPanelItem>{tabPanelItem}</TabPanelItem>;
          }}
        >

        </TabPanel>
      </Modal>
    </DataColumnSeriesOptionsContext.Provider>
  );
};

export default DataColumnSeriesOptions;
