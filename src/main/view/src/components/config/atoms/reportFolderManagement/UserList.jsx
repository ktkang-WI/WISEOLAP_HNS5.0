import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {ReportFolderContext}
  // eslint-disable-next-line max-len
  from 'components/config/organisms/reportFolderManagement/ReportFolderManagement';
import {Column, SearchPanel, Selection} from 'devextreme-react/tree-list';
import React, {useContext} from 'react';
import Title from '../common/Title';
import {DataGrid} from 'devextreme-react';
import {getPrivateFolderReports}
  from 'models/config/reportFolderManagement/ReportFolderManagement';
import useModal from 'hooks/useModal';
import {dataPrepro, Mode}
  // eslint-disable-next-line max-len
  from 'components/config/organisms/reportFolderManagement/data/ReportFolderManagementData';
import localizedString from 'config/localization';

const UserList = ({setRows, setRowData}) => {
  const userListContext = useContext(ReportFolderContext);
  const {alert} = useModal();

  const list = userListContext.state.data[0];

  const handleRowClick = (e) => {
    if (!e.data?.userNo) {
      return;
    }

    getPrivateFolderReports({userNo: e.data.userNo}).then((res) => {
      if (res.data.data) {
        const param = {
          data: res.data.data,
          mode: Mode.REPORT_MANAGEMENT
        };
        const newData = dataPrepro(param);
        setRows(newData);
        setRowData([]);
      }
    }).catch((e) => {
      console.log(e);
      alert(localizedString.privateReportGetError);
    });
  };

  return (
    <Wrapper>
      <Title title={localizedString.userList}></Title>
      <DataGrid
        width={'auto'}
        showColumnHeaders={true}
        dataSource={list}
        keyExpr="userNo"
        elementAttr={{
          class: 'report-list'
        }}
        columnAutoWidth={true}
        height={'calc(100% - 40px)'}
        onRowClick={handleRowClick}
      >
        <Selection mode='single' key={'reportNm'}/>
        <SearchPanel
          visible={true}
          width={'250'}
        />
        <Column
          dataField="userId"
          caption={localizedString.userId}
          // cellRender={cellRender}
        />
        <Column
          dataField="userNm"
          caption={localizedString.userNm}
        />
      </DataGrid>
    </Wrapper>
  );
};
export default React.memo(UserList);
