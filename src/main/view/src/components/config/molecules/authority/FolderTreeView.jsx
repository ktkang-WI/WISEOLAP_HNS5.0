import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import TreeList, {
  Column,
  Editing,
  SearchPanel,
  Selection} from 'devextreme-react/tree-list';
import React, {useContext, useRef, useEffect, useState} from 'react';
import Title from 'components/config/atoms/common/Title';
import {AuthorityContext} from
  'components/config/organisms/authority/Authority';
import localizedString from 'config/localization';
import {getFolders}
  from 'models/config/reportFolderManagement/ReportFolderManagement';

const FolderTreeView = ({row}) => {
  // context
  const authoritycontext = useContext(AuthorityContext);

  // state
  const [folders, setFolders] = useState([]);
  const [data] = authoritycontext.state.data;
  const ref = useRef();

  useEffect(() => {
    getFolders()
        .then((response) => {
          const newFolders = response.data.data.map((row) => {
            return {
              ...row,
              authView: false,
              authPublish: false,
              authDataItem: false,
              authExport: false
            };
          });
          setFolders(newFolders);
        })
        .catch(() => {
          throw new Error('Data Loading Error');
        });
  }, []);

  useEffect(() => {
    const updateFolders = (folderList) => {
      const newFolders = folders.map((row) => {
        const fldId = row.fldId;
        const auth = folderList?.find((f) => fldId === f.folder.fldId)?.auth;

        if (auth) {
          if (typeof auth.authView === 'string') {
            auth.authView = auth.authView === 'Y' ? true : false;
            auth.authPublish = auth.authPublish === 'Y' ? true : false;
            auth.authDataItem = auth.authDataItem === 'Y' ? true : false;
            auth.authExport = auth.authExport === 'Y' ? true : false;
          }
          return {
            ...row,
            ...auth
          };
        }
        return {
          ...row,
          authView: false,
          authPublish: false,
          authDataItem: false,
          authExport: false
        };
      });

      setFolders(newFolders);
    };

    if (row) {
      const groups = data.filter((d) => d.group);
      const users = data.filter((d) => d.user);
      let folderList = [];

      if (groups.length > 0) {
        const group = data.find((d) => d.group?.grpId === row.grpId);
        folderList = group?.folderList;
      }

      if (users.length > 0) {
        const user = data.find((d) => d.user?.userNo === row.userNo);
        folderList = user?.folderList;
      }
      updateFolders(folderList);
    }
  }, [row]);

  const onRowUpdating = (e) => {
    const newFolders = folders.map((folder) => {
      if (folder.fldParentId !== e.oldData.fldId) {
        return folder;
      }
      return {...folder, ...e.newData};
    });

    setFolders(newFolders);
  };

  return (
    <Wrapper>
      <Title title={localizedString.publicReportFolderList}></Title>
      <TreeList
        ref={ref}
        elementAttr={{
          class: 'folder-tree-view'
        }}
        dataSource={folders}
        keyExpr="fldId"
        parentIdExpr="fldParentId"
        id="folderTreeView"
        height={'90%'}
        onRowUpdating={onRowUpdating}
      >
        <Editing
          mode="cell"
          allowUpdating={true}
        />
        <SearchPanel
          visible={true}
          width={250}
        />
        <Selection mode="none" />

        <Column
          dataField="fldNm"
          caption={localizedString.folderName}
        />
        <Column
          dataField="authView"
          dataType='boolean'
          caption={localizedString.querySearch}
        >
        </Column>
        <Column
          dataField="authPublish"
          dataType='boolean'
          caption={localizedString.reportView}
        >
        </Column>
        <Column
          dataField="authDataItem"
          dataType='boolean'
          caption={localizedString.useDataitem}
        >
        </Column>
        <Column
          dataField="authExport"
          dataType='boolean'
          caption={localizedString.reportDownload}
        >
        </Column>
        <Column
          dataField="fldParentId"
          visible={false}
        >
        </Column>
      </TreeList>
    </Wrapper>
  );
};

export default React.memo(FolderTreeView);
