import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import TreeList, {
  Column,
  SearchPanel,
  Selection} from 'devextreme-react/tree-list';

import React, {useContext, useEffect, useState} from 'react';
import Title from 'components/config/atoms/common/Title';
import localizedString from 'config/localization';
import {ReportFolderContext} from
  'components/config/organisms/reportFolderManagement/ReportFolderManagement';
import folderImg from 'assets/image/icon/report/folder_load.png';
import dash from 'assets/image/icon/report/dash.png';
import excel from 'assets/image/icon/report/excel_file.png';
import adhoc from 'assets/image/icon/report/adhoc.png';

const ReportList = ({setRow}) => {
  // context
  const reportFolderContext = useContext(ReportFolderContext);

  // state
  const [data] = reportFolderContext.state.data;
  const reportListRef = reportFolderContext.ref.reportListRef;
  const [reports, setReports] = useState();

  useEffect(() => {
    const newData = data.reduce((acc, v) => {
      const folderIdList = acc.map((row) => row.fldId);

      if (!folderIdList.includes(v.fldId)) {
        const fldParentId = v.fldParentId === 0 ?
        v.fldParentId : 'f_' + v.fldParentId;
        acc.push({
          fldId: v.fldId,
          fldLvl: v.fldLvl,
          fldNm: v.fldNm,
          fldOrdinal: v.fldOrdinal,
          parentId: fldParentId,
          key: 'f_' + v.fldId,
          name: v.fldNm,
          type: 'folder'
        });
      }

      acc.push({
        ...v,
        key: 'r_'+ v.reportId,
        parentId: 'f_' + v.fldId,
        name: v.reportNm
      });

      return acc;
    }, []);
    setReports(newData);
  }, [data]);

  const handleRowClick = ({data}) => {
    let newRow = {};
    if (data.type !== 'folder') {
      newRow = data;
    }
    setRow(newRow);
  };

  return (
    <Wrapper>
      <Title title={localizedString.reportlist}></Title>
      <TreeList
        ref={reportListRef}
        dataSource={reports}
        keyExpr="key"
        parentIdExpr="parentId"
        id="reportFolderManagementReportList"
        height={'90%'}
        onRowClick={handleRowClick}
      >
        <SearchPanel
          visible={true}
          width={250}
        />
        <Selection mode="single" />
        <Column
          dataField="name"
          caption={localizedString.reportName}
          cellRender={({row}) => {
            let img = folderImg;
            if (row.data.reportType === 'DashAny') {
              img = dash;
            }
            if (row.data.reportType === 'AdHoc') {
              img = adhoc;
            }
            if (row.data.reportType === 'Spread' ||
            row.data.reportType == 'Excel') {
              img = excel;
            }
            return (
              <span>
                <img height={'17px'} src={img}/>
                {row.data.name}
              </span>
            );
          }}
        />
      </TreeList>
    </Wrapper>
  );
};

export default React.memo(ReportList);
