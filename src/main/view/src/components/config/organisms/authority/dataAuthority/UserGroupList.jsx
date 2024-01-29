import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
// import models from 'models';
import {useRef} from 'react';
import {useContext} from 'react';

const UserGroupList = () => {
  const getContext = useContext(AuthorityContext);
  const [data] = getContext.state.data;

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
        dataField="grpNm"
        caption="그룹 명"
        dataType="varchar"
        format="currency"
      />
      <Column
        dataField="grpDesc"
        caption="설명"
        dataType="varchar"
        format="currency"
      />
    </DataGrid>
  );
};

export default UserGroupList;
