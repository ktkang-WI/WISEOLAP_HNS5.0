import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import ReportInformation
  from 'components/config/atoms/reportFolderManagement/ReportInformation';
import ReportList
  from 'components/config/atoms/reportFolderManagement/ReportList';
import React from 'react';

const ReportManagement = ({data}) => {
  // const [row, setRow] = useState();
  // const auth = data;

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper padding='10px'>
        <ReportList/>
      </Wrapper>
      <Wrapper padding='10px'>
        <ReportInformation/>
      </Wrapper>
    </Wrapper>
  );
};

export default React.memo(ReportManagement);
