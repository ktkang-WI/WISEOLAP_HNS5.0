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

const ReportList = ({setRow}) => {
  // context
  const reportFolderContext = useContext(ReportFolderContext);

  // state
  const [data] = reportFolderContext.state.data;
  console.log('ReportList', data);

  return (
    <Wrapper>
      <Title title={localizedString.reportlist}></Title>
      <TreeList
        dataSource={data}
        keyExpr="fldId"
        parentIdExpr="fldParentId"
        id="reportFolderManagementReportList"
        height={'90%'}
      >
        <SearchPanel
          visible={true}
          width={250}
        />
        <Selection mode="single" />
        <Column
          dataField="fldNm"
          caption={localizedString.reportName}
        />
      </TreeList>
    </Wrapper>
  );
};

export default React.memo(ReportList);
