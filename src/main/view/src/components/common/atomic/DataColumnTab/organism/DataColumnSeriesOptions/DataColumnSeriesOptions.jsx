import {TabPanel} from 'devextreme-react';
import Modal from '../../../Modal/organisms/Modal';
import {createContext, useState} from 'react';
import {dataSource} from './metaData/SeriesOptionData';

export const DataColumnSeriesOptionsContext = createContext();

const TabPanelItem = ({children}) => {
  return (
    <>{children}</>
  );
};

const DataColumnSeriesOptions = ({onClose, parameterInfo, onSubmit}) => {
  // useState
  const [tabPanelItem, setTabPanelItem] = useState(dataSource[0].component);


  const handleTabPanelItem = (e) => {
    const panelTitle = e.itemData.title;
    dataSource.forEach((item) => {
      if (item.title === panelTitle) {
        setTabPanelItem(item.component);
        return;
      }
    });
  };

  return (
    <DataColumnSeriesOptionsContext.Provider
      value='none'
    >
      <Modal
        onSubmit={() => {
          console.log('DataColumnSeriesOptions open !!');
          // onSubmit(newParamInfo);
        }}
        height='700px'
        width='500px'
        modalTitle='시리즈 옵션'
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
