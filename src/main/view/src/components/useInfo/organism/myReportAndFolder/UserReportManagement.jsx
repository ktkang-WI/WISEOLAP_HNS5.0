
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
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
import removeImg from 'assets/image/icon/button/remove_white.png';
import folderImg from 'assets/image/icon/report/folder_load.png';
import dashImg from 'assets/image/icon/report/dash.png';
import excelImg from 'assets/image/icon/report/excel_file.png';
import adhocImg from 'assets/image/icon/report/adhoc.png';
import {DesignerMode} from 'components/config/configType';

const iconMapper = {
  'FOLDER': folderImg,
  [DesignerMode.DASHBOARD]: dashImg,
  [DesignerMode.AD_HOC]: adhocImg,
  [DesignerMode.EXCEL]: excelImg
};

const theme = getTheme();

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
    border-radius: 6px;
  }
`;

const smallButton = {
  height: '30px',
  borderRadius: '4px',
  font: theme.font.smallButton
};

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
    confirm(localizedString.changeReportNmConfirm, () => {
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
      alert(localizedString.selectReportAndDeleteConfirm);
    } else {
      confirm(localizedString.reportDeleteConfirm, () => {
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

  const itemRender = (item) => {
    return (
      <div className="dx-item-content dx-treeview-item-content">
        <img width='16px' src={iconMapper[item.type]} className="dx-icon"/>
        <span>{item.name}</span>
      </div>
    );
  };

  return (
    <Wrapper display='flex' direction='row'>
      <Panel
        title={localizedString.report}
        height='100%'
        width='50%'
        padding='10'
      >
        <div style={{width: '100%', height: '50%', textAlign: 'left'}}>
          <StyledTreeView
            height='100%'
            width='100%'
            items={treeViewData.folderReport}
            dataStructure="plain"
            displayExpr="name"
            selectionMode='single'
            parentIdExpr="fldParentId"
            keyExpr="id"
            noDataText={localizedString.noReports}
            searchEnabled={true}
            searchEditorOptions={{
              placeholder: localizedString.search,
              width: '300px'
            }}
            itemRender={itemRender}
            focusStateEnabled={true}
            onItemClick={handleItemClick}
          />
          <div style={{
            display: 'flex',
            height: '50%',
            padding: '10px 20px',
            justifyContent: 'right'
          }}>
            <CommonButton
              {...smallButton}
              width='70px'
              type='red'
              onClick={onClickRemove}
            >
              <img height='20px' src={removeImg}/>
              {localizedString.deleteReport}
            </CommonButton>
          </div>
        </div>
      </Panel>
      <Panel
        title={localizedString.reportInformation}
        height='100%'
        width='50%'
        padding='10'
      >
        <Context.Provider value={context}>
          <MyPageReportForm/>
        </Context.Provider>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '10px'
        }}>
          <CommonButton width={'300px'} onClick={onClickSave}>
            {localizedString.saveReport}
          </CommonButton>
        </div>
      </Panel>
    </Wrapper>
  );
};
export default React.memo(UserReprotManagement);
