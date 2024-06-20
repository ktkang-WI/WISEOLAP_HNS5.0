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

const DatasetTreeView = () => {
  // context
  const getContext = useContext(AuthorityContext);
  const dataSource = getContext.state.folderDataSets;

  const ref = useRef();

  return (
    <Wrapper>
      <Title title={localizedString.datasetFolderList}></Title>
      <TreeList
        ref={ref}
        elementAttr={{
          class: 'dataset-tree-view'
        }}
        dataSource={dataSource}
        keyExpr="fldId"
        parentIdExpr="fldParentId"
        id="folderTreeView"
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
          width="50px"
          dataField="isAuth"
          dataType='boolean'
          caption=""
        />
        <Column
          dataField="fldNm"
          caption={localizedString.folderName}
        />
      </TreeList>
    </Wrapper>
  );
};

export default React.memo(DatasetTreeView);
