import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
// import models from 'models';
import {useRef} from 'react';
// import {useContext} from 'react';
// import {AuthorityContext} from '../Authority';

const UserList = ({data}) => {
  // const getContext = useContext(AuthorityContext);

  console.log(data);
  // useEffect(() => {
  //   models.Config.getUsers()
  //       .then((response) => {

  //       })
  //       .catch(() => {
  //         throw new Error('Data Loading Error');
  //       });
  // }, []);

  const ref = useRef();
  const groupsFormat = {};
  const handleRowClick = () => {
    return;
  };

  return (
    <DataGrid
      height={600}
      dataSource={groupsFormat}
      showBorders={true}
      onRowClick={handleRowClick}
      ref={ref}
    >
      <Selection mode="single" />
      <Column
        dataField="userId"
        caption="사용자 ID"
        dataType="varchar"
        format="currency"
      />
      <Column
        dataField="userNm"
        caption="사용자명"
        dataType="varchar"
        format="currency"
      />
      <Column
        dataField="grpNm"
        caption="그룹명"
        dataType="varchar"
        format="currency"
      />
    </DataGrid>
  );
};

export default UserList;
