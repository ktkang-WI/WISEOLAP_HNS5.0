import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import TreeList, {
  Column,
  Editing,
  SearchPanel,
  Selection} from 'devextreme-react/tree-list';

import models from 'models';
import React, {useContext, useEffect, useState, useRef} from 'react';
import Title from 'components/config/atoms/common/Title';
import {AuthorityContext} from
  'components/config/organisms/authority/Authority';
import localizedString from 'config/localization';

const DatasetTreeView = ({row}) => {
  // context
  const authoritycontext = useContext(AuthorityContext);

  // state
  const [dataSets, setDataSet] = useState([]);
  const [data] = authoritycontext.state.data;

  const ref = useRef();

  useEffect(() => {
    models.Authority.getFolderDatasets()
        .then((response) => {
          const newDataSets = response.data.data.map((row) => {
            return {
              ...row,
              isAuth: false
            };
          });

          setDataSet(newDataSets);
        })
        .catch(() => {
          throw new Error('Data Loading Error');
        });
  }, []);

  useEffect(() => {
    const updateFolders = (fldIdList) => {
      const newDataSets = dataSets.map((f) => {
        if (fldIdList?.includes(f.fldId)) {
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

      setDataSet(newDataSets);
    };

    if (row) {
      const groups = data.filter((d) => d.group);
      const users = data.filter((d) => d.user);
      let fldIdList = [];

      if (groups.length > 0) {
        const group = data.find((d) => d.group?.grpId === row.grpId);
        fldIdList = group?.dataset;
      }

      if (users.length > 0) {
        const user = data.find((d) => d.user?.userNo === row.userNo);
        fldIdList = user?.dataset;
      }
      fldIdList = fldIdList?.map((row) => row.fldId);
      updateFolders(fldIdList);
    }
  }, [row]);

  return (
    <Wrapper>
      <Title title={localizedString.datasetFolderList}></Title>
      <TreeList
        ref={ref}
        elementAttr={{
          class: 'dataset-tree-view'
        }}
        dataSource={dataSets}
        keyExpr="fldId"
        parentIdExpr="fldParentId"
        id="folderTreeView"
        height={'90%'}
      >
        <Editing
          mode="cell"
          allowUpdating={true}
        />
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
          caption={localizedString.folderName}
        />
      </TreeList>
    </Wrapper>
  );
};

export default React.memo(DatasetTreeView);
