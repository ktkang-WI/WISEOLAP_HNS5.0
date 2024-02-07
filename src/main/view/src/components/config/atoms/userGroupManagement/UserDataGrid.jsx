
import {UserGroupContext}
  from 'components/config/organisms/userGroupManagement/UserGroupManagement';
import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import _ from 'lodash';
import {useContext, useEffect, useRef} from 'react';
import localizedString from 'config/localization';
import {handleRowClick} from 'components/config/utility/utility';
import models from 'models';

const UserDataGrid = () => {
  const getContext = useContext(UserGroupContext);

  const [usersFormat] = getContext.state.usersFormat;
  const [userDetailInfo, setUserDetailInfo] = getContext.state.userDetailInfo;

  const ref = useRef();

  if (_.isEmpty(userDetailInfo)) {
    ref.current?._instance.clearSelection();
  }

  useEffect(() => {
    models.UserGroupManagement.getUserGroupManagement()
        .then((res) => {
          if (res.status != 200) {
            return res.error;
          }

          return res.data.data;
        });
  }, []);

  return (
    <Panel title={'사용자 (' + usersFormat.length + '명)'}>
      <DataGrid
        height={600}
        dataSource={usersFormat}
        showBorders={true}
        onRowClick={({data}) => handleRowClick(data, setUserDetailInfo)}
        ref={ref}
      >
        <Selection mode="single" />
        <Column
          dataField="userId"
          caption={localizedString.userId}
        />
        <Column
          dataField="userNm"
          caption={localizedString.userName}
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="grpNm"
          caption={localizedString.groupName}
          dataType="varchar"
          format="currency"
        />
      </DataGrid>
    </Panel>
  );
};

export default UserDataGrid;
