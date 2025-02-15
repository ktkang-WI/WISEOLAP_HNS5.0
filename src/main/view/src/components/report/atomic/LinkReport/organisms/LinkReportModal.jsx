import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {styled} from 'styled-components';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import localizedString from 'config/localization';
import ReportListTab from
  'components/common/atomic/ReportTab/organism/ReportListTab';
import {useCallback, useEffect, useState} from 'react';
import models from 'models';
import {setIconReportList} from 'components/report/util/ReportUtility';
import LinkReportList from '../molecules/LinkReportList';
import LinkReportRibbon from '../molecules/LinkReportRibbon';
import useModal from 'hooks/useModal';
import LinkSlice from 'redux/modules/LinkSlice';
import {useSelector, useDispatch} from 'react-redux';
import {
  selectCurrentDesignerMode
} from 'redux/selector/ConfigSelector';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectLinkedReport} from 'redux/selector/LinkSelector';
import {
  selectCurrentReport
} from 'redux/selector/ReportSelector';
import {
  selectCurrentInformationas
} from 'redux/selector/ParameterSelector';

const StyledWrapper = styled(Wrapper)`
width: 100%;
height: 100%;
display: flex;
align-items: flex-start;
justify-content: center;
`;
const LinkReportModal = ({
  subYn,
  subLinkDim,
  existLinkReports,
  ...props
}) => {
  const [reportList, setReportList] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const dispatch = useDispatch();
  const {deleteLink, overWriteLinkReport} = LinkSlice.actions;
  const handleReportSelection = (selectedRowData) => {
    setSelectedReport(selectedRowData);
  };
  const {alert} = useModal();
  const designerMode = useSelector(selectCurrentDesignerMode);
  const currentReportId = useSelector(selectCurrentReportId);
  const selectLinkedReportList = useSelector(selectLinkedReport);
  const currentReport = useSelector(selectCurrentReport);
  const currentItemParam = useSelector(selectCurrentInformationas);

  useEffect(() => {
    models.Report.getList(designerMode, 'designer').then(({data}) => {
      setIconReportList(data.publicReport);
      setReportList(data);
    }).catch((e) => {
      console.log(e);
    });
    if (existLinkReports) {
      const selectedLinkReports = (data) => {
        return Object.keys(data).map((key) => {
          const {linkReportId, linkReportNm, linkReportType} = data[key];
          return {id: linkReportId, name: linkReportNm, type: linkReportType};
        });
      };
      setDataSource(selectedLinkReports(existLinkReports));
    }
  }, []);

  const handleItemSelect = useCallback((itemData) => {
    setSelectedItem(itemData);
  }, []);

  const addLinkReport = () => {
    if (selectedItem && selectedItem.type === 'REPORT') {
      const itemExists = dataSource.some(
          (item) => item.name === selectedItem.name &&
          item.id === selectedItem.id);
      if (currentReportId === selectedItem.id) {
        alert(localizedString.linkReportitself);
      } else if (!itemExists) {
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
      alert('삭제할 연결보고서를 선택해주세요');
    }
  };

  const insertUnMappingLinkReports = async (
      dataSource, selectLinkedReportList, currentReport) => {
    const updatedLinkedReportList = {...selectLinkedReportList};
    for (const item of dataSource) {
      if (!updatedLinkedReportList[item.id]) {
        let recieveData;
        try {
          recieveData = await models.Report.getLinkReportParam({
            reportId: item.id
          });
        } catch (error) {
          console.error('Error fetching link report params:', error);
          alert('연결 보고서 정보를 가져오는데 실패했습니다.');
        }
        let parsedParamData;
        let reportParamInfo;
        if (recieveData?.data?.informations ) {
          parsedParamData = JSON.parse(recieveData?.data?.informations);
          reportParamInfo = currentItemParam.map((item, index) => {
            return {
              linkReportId: recieveData.data.reports[0].reportId,
              pkNm: item.caption,
              pkParam: item.name,
              MfkNm: 'None',
              fkParam: 'None'
            };
          });
        } else {
          parsedParamData = [];
        }
        updatedLinkedReportList[item.id] = {
          reportId: currentReport.reportId,
          reportNm: currentReport.options.reportNm,
          reportType: currentReport.options.reportType,
          linkReportId: item.id,
          linkReportNm: item.name,
          linkReportType: item.reportType,
          linkParamInfo: reportParamInfo || [],
          linkFkInfo: parsedParamData || []
        };
      };
    }
    return updatedLinkedReportList;
  };

  const onSubmit = async () => {
    if (dataSource) {
      const newLinkedReportList =
      await insertUnMappingLinkReports(
          dataSource,
          selectLinkedReportList,
          currentReport
      );
      dispatch(overWriteLinkReport(newLinkedReportList));
    }
  };
  return (
    <Modal
      onSubmit={onSubmit}
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
          subYn={subYn}
          subLinkDim={subLinkDim}
        />
      </StyledWrapper>
    </Modal>
  );
};

export default LinkReportModal;
