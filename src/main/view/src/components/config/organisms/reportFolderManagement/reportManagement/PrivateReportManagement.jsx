import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import PrivateReportList
  from 'components/config/atoms/reportFolderManagement/PrivateReportList';
import ReportInformation
  from 'components/config/atoms/reportFolderManagement/ReportInformation';
import UserList from 'components/config/atoms/reportFolderManagement/UserList';
import React, {useState} from 'react';

const PrivateReportManagement = () => {
  const [rows, setRows] = useState([]);
  const [rowData, setRowData] = useState([]);

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper padding='10px'>
        <UserList
          setRows={setRows}
          setRowData={setRowData}
        />
      </Wrapper>
      <Wrapper padding='10px'>
        <PrivateReportList
          data={rows}
          setRowData={setRowData}
        />
      </Wrapper>
      <Wrapper padding='10px' width={'110%'}>
        <ReportInformation
          row={rowData}
          setRow={setRowData}
          flag={'privateReport'}
        />
      </Wrapper>
    </Wrapper>
  );
};
export default React.memo(PrivateReportManagement);
