import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import FolderInformation
  from 'components/config/atoms/reportFolderManagement/FolderInformation';
import FolderList
  from 'components/config/atoms/reportFolderManagement/FolderList';
import React, {useState} from 'react';

const FolderManagement = ({data}) => {
  const [row, setRow] = useState({});

  return (
    <Wrapper display='flex' direction='row'>
      <Wrapper padding='10px'>
        <FolderList
          setRow={setRow}
        />
      </Wrapper>
      <Wrapper padding='10px'>
        <FolderInformation
          row={row}
          setRow={setRow}
        />
      </Wrapper>
    </Wrapper>
  );
};

export default React.memo(FolderManagement);
