import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import TreeList, {
  Column,
  SearchPanel,
  Selection} from 'devextreme-react/tree-list';

import React, {useContext} from 'react';
import Title from 'components/config/atoms/authority/Title';
import localizedString from 'config/localization';
import {ReportFolderContext} from
  'components/config/organisms/reportFolderManagement/ReportFolderManagement';

const FolderList = ({setRow}) => {
  // context
  const reportFolderContext = useContext(ReportFolderContext);

  // state
  const [data] = reportFolderContext.state.data;
  console.log('FolderList', data);

  return (
    <Wrapper>
      <Title title={localizedString.folderList}></Title>
      <TreeList
        dataSource={data}
        keyExpr="fldId"
        parentIdExpr="fldParentId"
        id="reportFolderManagementFolderList"
        height={'90%'}
      >
        <SearchPanel
          visible={true}
          width={250}
        />
        <Selection mode="single" />
        <Column
          dataField="fldNm"
          caption={localizedString.folderName}
        />
      </TreeList>
    </Wrapper>
  );
};

export default React.memo(FolderList);
