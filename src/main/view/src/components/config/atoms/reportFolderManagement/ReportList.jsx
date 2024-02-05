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
  // const [reports, setReports] = useState([]);
  // console.log(data);

  // console.log('ReportFolderManagement ReportList Mount!!!!');
  // console.log('ReportList', data);
  // const newData = data.reduce((acc, v) => {
  //   const folderIdList = acc.map((row) => row.folderId);

  //   if (!folderIdList.includes(v.reportId)) {
  //     acc.push({
  //       fldId: v.fldId,
  //       fldLvl: v.fldLvl,
  //       fldNm: v.fldNm,
  //       fldOrdinal: v.fldOrdinal,
  //       fldParentId: v.fldParentId
  //     });
  //   }

  //   acc.push({
  //     ...v,
  //     fldParentId: v.fldId
  //   });

  //   return acc;
  // }, []);

  // setReports(newData);
  // console.log('newData', newData);


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
          caption={localizedString.folderName}
        />
        <Column
          dataField="reportNm"
          caption={localizedString.reportName}
        />
      </TreeList>
    </Wrapper>
  );
};

export default React.memo(ReportList);
