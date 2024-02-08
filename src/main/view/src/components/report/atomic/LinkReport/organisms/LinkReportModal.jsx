import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {styled} from 'styled-components';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import localizedString from 'config/localization';
import ReportListTab from
  'components/common/atomic/ReportTab/organism/ReportListTab';
import {useCallback, useEffect, useState} from 'react';
import models from 'models';
import {setIconReportList} from 'components/report/util/ReportUtility';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import store from 'redux/modules';
import LinkReportList from '../molecules/LinkReportList';
import LinkReportRibbon from '../molecules/LinkReportRibbon';
import useModal from 'hooks/useModal';

const StyledWrapper = styled(Wrapper)`
width: 100%;
height: 100%;
display: flex;
align-items: flex-start;
justify-content: center;
`;
const LinkReportModal = ({
  loadExcelFile,
  ...props
}) => {
  const [reportList, setReportList] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const {alert} = useModal();

  useEffect(() => {
    const reportType = selectCurrentDesignerMode(store.getState());
    models.Report.getList('admin', reportType, 'designer').then(({data}) => {
      setIconReportList(data.privateReport);
      setIconReportList(data.publicReport);
      setReportList(data);
    });
  }, []);
  console.log('reportList', reportList);

  const onAddButtonClick = () => {
    addReportToDataSource();
  };

  const handleItemSelect = useCallback((itemData) => {
    setSelectedItem(itemData); // Store the selected item
    console.log('LinkReportModal itemData', itemData);
    console.log('LinkReportModal selectedItem', selectedItem);
  }, []);

  const addReportToDataSource = () => {
    if (selectedItem && selectedItem.type === 'REPORT') {
      const itemExists = dataSource.some(
          (item) => item.name === selectedItem.name &&
          item.id === selectedItem.id);
      console.log('itemExists', itemExists);
      if (!itemExists) {
        setDataSource((prevDataSource) =>
          [...prevDataSource,
            {
              name: selectedItem.name,
              id: selectedItem.id,
              reportType: selectedItem.reportType
            }]);
      } else {
        alert(localizedString.linkReportAlready);
      }
      console.log('LinkReportModal dataSource', dataSource);
    }
  };

  return (
    <Modal
      onsSubmit={()=> {
        console.log('submit');
        return true;
      }}
      modalTitle={localizedString.linkReport}
      height="700px"
      width="1000px"
      {...props}
    >
      <StyledWrapper>
        <ReportListTab
          title='보고서 목록'
          items={reportList? reportList['publicReport'] : []}
          width='44%'
          // height='80%'
          // onSelectionChanged={onSelectionChanged}
          selectionMode='single'
          selectByClick={true}
          selectNodesRecursive={false}
          onItemSelect={handleItemSelect}
        >
        </ReportListTab>
        <LinkReportRibbon
          width='12%'
          onAddButtonClick={onAddButtonClick}
        />
        <LinkReportList
          width='44%'
          dataSource={dataSource}
        />
      </StyledWrapper>
    </Modal>
  );
};

export default LinkReportModal;
