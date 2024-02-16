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
import LinkSlice from 'redux/modules/LinkSlice';
import {useDispatch} from 'react-redux';

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
  const [selectedReport, setSelectedReport] = useState(null);
  const dispatch = useDispatch();
  const {deleteLink} = LinkSlice.actions;
  const handleReportSelection = (selectedRowData) => {
    setSelectedReport(selectedRowData);
  };
  const {alert} = useModal();

  useEffect(() => {
    const reportType = selectCurrentDesignerMode(store.getState());
    models.Report.getList('admin', reportType, 'designer').then(({data}) => {
      setIconReportList(data.publicReport);
      setReportList(data);
    });
  }, []);

  const handleItemSelect = useCallback((itemData) => {
    setSelectedItem(itemData);
  }, []);

  const addLinkReport = () => {
    if (selectedItem && selectedItem.type === 'REPORT') {
      const itemExists = dataSource.some(
          (item) => item.name === selectedItem.name &&
          item.id === selectedItem.id);
      if (!itemExists) {
        setDataSource((prevDataSource) =>
          [...prevDataSource,
            selectedItem
          ]);
      } else {
        alert(localizedString.linkReportAlready);
      }
    }
  };

  const removeLinkReport = () => {
    if (selectedReport && selectedReport.id) {
      setDataSource(
          (prevDataSource) =>
            prevDataSource.filter((item) => item.id !== selectedReport.id)
      );
      dispatch(deleteLink({linkReportId: selectedReport.id}));
    } else {
      alert('Please select an item to remove.');
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
          selectionMode='single'
          selectByClick={true}
          selectNodesRecursive={false}
          onItemSelect={handleItemSelect}
        >
        </ReportListTab>
        <LinkReportRibbon
          width='12%'
          addLinkReport={addLinkReport}
          removeLinkReport={removeLinkReport}
        />
        <LinkReportList
          width='44%'
          dataSource={dataSource}
          onSelectionChange={handleReportSelection}
        />
      </StyledWrapper>
    </Modal>
  );
};

export default LinkReportModal;
