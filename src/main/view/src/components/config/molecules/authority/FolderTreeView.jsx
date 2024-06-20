import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import TreeList, {
  Column,
  Editing,
  SearchPanel,
  Selection} from 'devextreme-react/tree-list';
import React, {useContext, useRef} from 'react';
import Title from 'components/config/atoms/common/Title';
import {AuthorityContext} from
  'components/config/organisms/authority/Authority';
import localizedString from 'config/localization';

const FolderTreeView = ({row}) => {
  // context
  const getContext = useContext(AuthorityContext);
  const dataSource = getContext.state.folder;
  const data = getContext.state.data;
  const ref = useRef();
  console.log(data);

  return (
    <Wrapper>
      <Title title={localizedString.publicReportFolderList}></Title>
      <TreeList
        ref={ref}
        elementAttr={{
          class: 'folder-tree-view'
        }}
        dataSource={dataSource}
        keyExpr="fldId"
        parentIdExpr="fldParentId"
        id="folderTreeView"
        editable={false}
        height={'90%'}
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
