
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import MyPageReportForm from 'components/useInfo/molcule/MyPageReportForm';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import {TreeView} from 'devextreme-react';
import useModal from 'hooks/useModal';
import {updateMyPageReport}
  from 'models/config/reportFolderManagement/ReportFolderManagement';
import {deleteReport} from 'models/report/Report';
import React, {createContext, useState} from 'react';
import {useLoaderData} from 'react-router-dom';
import {userFolderData} from 'routes/loader/LoaderConfig';
import styled from 'styled-components';

const theme = getTheme();

const Wrapper = styled.div`
  padding-top: 10px;
  background: ${theme.color.panelColor};
  height: 100%;
  width: 100%;
  display: flex;
  text-align: left;
  box-sizing: border-box;
`;
const StyledTreeView = styled(TreeView)`
  color: ${theme.color.primaryFont};
  font: ${theme.font.dataSource};
  padding: 20px;
  box-sizing: border-box;
  letter-spacing: -1px;
  .dx-treeview-toggle-item-visibility {
    color: ${theme.color.primaryFont};
  }

  .dx-treeview-item-content {
    transform: none !important;
  }

  .dx-scrollable-wrapper {
    border: 1px solid #D4D7DC;
  }
`;
export const Context = createContext();

const UserReprotManagement = () => {
  const reports = useLoaderData();
  const [treeViewData, setTreeViewData] = useState(reports);
  const [data, setData] = useState([]);
  const {confirm} = useModal();

  const context = {
    state: {
      report: [data, setData]
    }
  };

  const handleItemClick = (e) => {
    if (e.itemData.type == 'FOLDER') {
      setData({});
    } else {
      setData(e.itemData);
    }
  };
  const onClickSave = (e) => {
    confirm('보고서 내용을 변경 하시겠습니까?', () => {
      const report = data;
      updateMyPageReport(report).then((response) => {
        if (response.status == 200) {
          userFolderData().then((respose) => {
            setTreeViewData(respose);
          });
          setData({});
        }
      });
    });
  };
  const onClickRemove = (e) => {
    const reportId = data.id;
    if (reportId == '') {
      console.log('보고서를 선택 후 삭제 버튼을 눌러주세요.');
    } else {
      confirm('보고서를 삭제 하시겠니까?', () => {
        deleteReport({reportId: reportId}).then((response) => {
          if (response.status == 200) {
            userFolderData().then((respose) => {
              setTreeViewData(respose);
            });
          }
        });
      });
    }
  };
  return (
    <>
      <Wrapper>
        <ModalPanel
          title={localizedString.report}
          height='calc(100% - 250px)'
          width='35vw'
          padding='10'
        >
          <div style={{ // styled
            float: 'left',
            position: 'relative', width: '33vw', height: '60vh'}}>
            <StyledTreeView
              height='50vh'
              width='33vw'
              items={treeViewData.folderReport}
              dataStructure="plain"
              displayExpr="name"
              selectionMode='single'
              parentIdExpr="fldParentId"
              keyExpr="id"
              noDataText="조회된 보고서가 없습니다." // localized
              searchEnabled={true}
              searchEditorOptions={{
                placeholder: '검색',
                width: '300px'
              }}
              focusStateEnabled={true}
              onItemClick={handleItemClick}
            />
            <div style={{display: 'flex', position: 'absolute', right: '30px'}}>
              <CommonButton
                width='100px'
                onClick={onClickRemove}
              >삭제</CommonButton>
            </div>
          </div>
        </ModalPanel>
        <ModalPanel
          title={localizedString.reportInformation}
          height='calc(100% - 250px)'
          width='55vw'
          padding='10'
        >
          <Context.Provider value={context}>
            <MyPageReportForm/>
          </Context.Provider>
          <CommonButton onClick={onClickSave}>저장</CommonButton>
        </ModalPanel>
      </Wrapper>
    </>
  );
};
export default React.memo(UserReprotManagement);
