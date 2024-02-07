import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import TreeList, {
  Column,
  SearchPanel,
  Selection} from 'devextreme-react/tree-list';
import models from 'models';
import React, {useContext, useEffect, useState} from 'react';
import Title from 'components/config/atoms/common/Title';
import {AuthorityContext} from
  'components/config/organisms/authority/Authority';
import localizedString from 'config/localization';

const FolderTreeView = ({row}) => {
  // context
  const authoritycontext = useContext(AuthorityContext);

  // state
  const [folders, setFolders] = useState([]);
  const [data] = authoritycontext.state.data;

  useEffect(() => {
    models.Authority.getFolders()
        .then((response) => {
          setFolders(response.data.data);
        })
        .catch(() => {
          throw new Error('Data Loading Error');
        });
  }, []);

  useEffect(() => {
    const updateFolders = (folderList) => {
      const newFolders = folders.map((row) => {
        const fldId = row.fldId;
        const auth = folderList.find((f) => fldId === f.folder.fldId)?.auth;

        if (auth) {
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

      if (groups.length > 0) {
        const group = data.find((d) => d.group?.grpId === row.grpId);
        if (group) updateFolders(group.folderList);
      }

      if (users.length > 0) {
        const user = data.find((d) => d.user?.userNo === row.userNo);
        if (user) updateFolders(user.folderList);
      }
    }
  }, [row]);

  return (
    <Wrapper>
      <Title title={localizedString.publicReportFolderList}></Title>
      <TreeList
        dataSource={folders}
        keyExpr="fldId"
        parentIdExpr="fldParentId"
        id="folderTreeView"
        height={'90%'}
      >
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
