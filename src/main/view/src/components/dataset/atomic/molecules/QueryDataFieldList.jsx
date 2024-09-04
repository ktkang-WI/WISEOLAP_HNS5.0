import {TreeView} from 'devextreme-react/tree-view';
import models from 'models';
import {useState, useEffect} from 'react';

const QueryDataFieldList = ({dataSource}) => {
  const [datasource, setDatasource] = useState('');

  useEffect(() => {
    /* models.DBInfo.getTablesByMart(dataSource.dsId)
        .then(({data}) => {
          const tables = data.tables.rowData;
          const columns = data.columns.rowData;

          const tableList = tables.concat(columns);

          setDatasource(tableList);
        })
        .catch((error) => {
          console.error(error);
          // throw new Error('Data Loading Error');
        });
    */
    setDatasource('');
  }, []);

  const getyMartFromSearchValue = (searchValue) => {
    models.DBInfo.getTablesByMart(dataSource.dsId, searchValue)
        .then(({data}) => {
          const tables = data.tables.rowData;
          const columns = data.columns.rowData;

          const tableList = tables.concat(columns);

          setDatasource(tableList);
        })
        .catch((error) => {
          console.error(error);
          // throw new Error('Data Loading Error');
        });
  };

  return (
    <TreeView
      height='100%'
      dataSource={datasource}
      showColumnHeaders={false}
      searchEnabled={true}
      searchMode='contains'
      onOptionChanged={(e) => {
        if (e.name !== 'searchValue') return;
        if (e.value != '') {
          getyMartFromSearchValue(e.value);
        }
      }}
      rootValue={-1}
      expandNodesRecursive={false}
      searchEditorOptions={{
        valueChangeEvent: 'change'
      }}
      keyExpr='ID'
      parentIdExpr='PARENT_ID'
      scrollDirection='vertical'
      dataStructure='plain'
      displayExpr='DATA_CAPTION'
    >
    </TreeView>
  );
};

export default QueryDataFieldList;
