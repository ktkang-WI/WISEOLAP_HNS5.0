import {AuthorityContext}
  from 'components/config/organisms/authority/Authority';
import DataGrid, {Column, Selection} from 'devextreme-react/data-grid';
import models from 'models';
import React, {useContext, useEffect, useState, useRef} from 'react';
import passwordIcon from 'assets/image/icon/auth/ico_password.png';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/common/Title';
import localizedString from 'config/localization';
import {Group} from 'models/config/userGroupManagement/UserGroupManagement';

const GroupList = ({setRow}) => {
  // context
  const authoritycontext = useContext(AuthorityContext);

  // state
  const [groups, setGroups] = useState([]);
  const [data] = authoritycontext.state.data;

  const ref = useRef();

  const getReportGroups = (dataGroups) => {
    return dataGroups.filter((row) => {
      const reportAuthCheck = row.folderList
          .find((folder) => folder.auth.authView === 'Y' ||
            folder.auth.authPublish === 'Y' ||
            folder.auth.authDataItem === 'Y' ||
            folder.auth.authExport === 'Y');
      return reportAuthCheck;
    });
  };

  useEffect(() => {
    if (data[0]?.group) {
      let dataGroups = data.filter((row)=>row.group);
      if (data[0].folderList) {
        dataGroups = getReportGroups(dataGroups);
      }
      models.UserGroupManagement.getGroups()
          .then((response) => {
            const authGrpIdList = dataGroups
                .filter((row) => {
                  if (row.dsViews) {
                    if (row.dsViews?.dsViewId.length > 0) {
                      return row;
                    }
                  } else {
                    return row;
                  }
                })
                .map((row) => row.group.grpId);
            const groups = response.data.data;
            const newGroups = groups.map((group) => {
              const newGroup = new Group(group);
              newGroup.isAuth = authGrpIdList.includes(group.grpId) ?
              true: false;
              return newGroup;
            });
            setGroups(newGroups);
          })
          .catch(() => {
            throw new Error('Data Loading Error');
          });
    }
  }, [data]);

  const handleRowClick = ({data}) => {
    setRow(data);
  };

  return (
    <Wrapper>
      <Title title={localizedString.groupList}></Title>
      <DataGrid
        ref={ref}
        elementAttr={{
          class: 'group-list'
        }}
        height={'90%'}
        dataSource={groups}
        showBorders={true}
        onRowClick={handleRowClick}
      >
        <Selection mode="single" />
        <Column
          dataField="isAuth"
          caption=""
          dataType="varchar"
          format="currency"
          width="30px"
          cellRender={({value}) => {
            if (value) {
              return <img height={'15px'} src={passwordIcon}/>;
            }
          }}
        />
        <Column
          dataField="grpNm"
          caption={localizedString.groupName}
          dataType="varchar"
          format="currency"
        />
        <Column
          dataField="grpDesc"
          caption={localizedString.description}
          dataType="varchar"
          format="currency"
        />
      </DataGrid>
    </Wrapper>
  );
};

export default React.memo(GroupList);
