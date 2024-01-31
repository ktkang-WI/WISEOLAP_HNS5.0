import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import TreeList, {
  Column,
  SearchPanel,
  Selection} from 'devextreme-react/tree-list';

import models from 'models';
import {useContext, useEffect, useState} from 'react';
import Title from 'components/config/atoms/authority/Title';
import {AuthorityContext} from
  'components/config/organisms/authority/Authority';

const DatasetTreeView = ({row}) => {
  // context
  const authoritycontext = useContext(AuthorityContext);

  // state
  const [folders, setFolders] = useState([]);
  const [data] = authoritycontext.state.data;

  useEffect(() => {
    models.Authority.getFolderDatasets()
        .then((response) => {
          const newFolders = response.data.data.map((row) => {
            return {
              ...row,
              isAuth: false
            };
          });

          setFolders(newFolders);
        })
        .catch(() => {
          throw new Error('Data Loading Error');
        });
  }, []);

  useEffect(() => {
    const updateFolders = (fldIdList) => {
      const newFolders = folders.map((f) => {
        if (fldIdList.includes(f.fldId)) {
          return {
            ...f,
            isAuth: true
          };
        }
        return {
          ...f,
          isAuth: false
        };
      });

      setFolders(newFolders);
    };

    if (row) {
      const groups = data.filter((d) => d.group);
      const users = data.filter((d) => d.user);

      if (groups.length > 0) {
        const group = data.find((d) => d.group?.grpId === row.grpId);
        if (group) {
          const fldIdList = group.dataset.map((d) => d.fldId);
          updateFolders(fldIdList);
        } else {
          updateFolders([]);
        }
      }

      if (users.length > 0) {
        const user = data.find((d) => d.user?.userNo === row.userNo);
        if (user) {
          const fldIdList = user.dataset.map((d) => d.fldId);
          updateFolders(fldIdList);
        } else {
          updateFolders([]);
        };
      }
    }
  }, [row]);

  return (
    <Wrapper>
      <Title title={'데이터 집합 폴더 목록'}></Title>
      <TreeList
        dataSource={folders}
        keyExpr="fldId"
        parentIdExpr="fldParentId"
        id="folderTreeView"
        height={'90%'}
      >
        <SearchPanel
          visible={true}
          width={250}
        />
        <Selection mode="none" />

        <Column
          width="50px"
          dataField="isAuth"
          dataType='boolean'
          caption=""
        />
        <Column
          dataField="fldNm"
          caption="폴더 이름"
        />
      </TreeList>
    </Wrapper>
  );
};

export default DatasetTreeView;
