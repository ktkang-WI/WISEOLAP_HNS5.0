import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import ReportInformation
  from 'components/config/atoms/reportFolderManagement/ReportInformation';
import ReportList
  from 'components/config/atoms/reportFolderManagement/ReportList';
import React, {useState} from 'react';

const ReportManagement = ({data}) => {
  const [row, setRow] = useState({});
  // const auth = data;

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper padding='10px'>
        <ReportList setRow={setRow}/>
      </Wrapper>
      <Wrapper padding='10px'>
        <ReportInformation
          row={row}
          setRow={setRow}
        />
      </Wrapper>
    </Wrapper>
  );
};

export default React.memo(ReportManagement);
