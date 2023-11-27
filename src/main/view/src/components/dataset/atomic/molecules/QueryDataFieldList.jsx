import {Scrolling, TreeList, Column} from 'devextreme-react/tree-list';
import models from 'models';
import {useState, useEffect} from 'react';

const QueryDataFieldList = ({dataSource}) => {
  const [datasource, setDatasource] = useState('');

  useEffect(() => {
    models.DBInfo.getTablesByMart(dataSource.dsId)
        .then((response) => {
          const tables = response.tables.rowData;
          const columns = response.columns.rowData;

          const tableList = tables.concat(columns);

          setDatasource(tableList);
        })
        .catch(() => {
          throw new Error('Data Loading Error');
        });
  }, []);

  const displayCaption = (data) => {
    let caption = '';
    if (!data.COL_NM) {
      caption = data.TBL_CAPTION == null ? data.TBL_NM : data.TBL_CAPTION;
    } else {
      caption = data.COL_CAPTION == null ? data.COL_NM : data.COL_CAPTION;
    }

    return caption;
  };

  return (
    <TreeList
      height='100%'
      dataSource={datasource}
      showColumnHeaders={false}
      searchPanel={{
        visible: true,
        searchVisibleColumnsOnly: true,
        highlightSearchText: true,
        width: '280px'
      }}
      rootValue={-1}
      expandNodesOnFiltering={false}
      filterMode='matchOnly'
      keyExpr='ID'
      parentIdExpr='PARENT_ID'
    >
      <Scrolling mode='standard' />
      <Column
        dataField='ID'
        width="100%"
        calculateDisplayValue={displayCaption}
      />
    </TreeList>
  );
};

export default QueryDataFieldList;
