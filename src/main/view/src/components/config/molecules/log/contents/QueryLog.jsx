import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import DataGrid, {Column} from 'devextreme-react/data-grid';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/ext-inline_autocomplete';
import 'ace-builds/src-noconflict/ext-searchbox';
import {getTheme} from 'config/theme';
import {useState} from 'react';
import localizedString from 'config/localization';

const theme = getTheme();

const QueryLog = ({display, dataSource}) => {
  const [query, setQuery] = useState('');
  return (
    <Wrapper
      style={{display}}
    >
      <DataGrid
        selection={{mode: 'single'}}
        onSelectionChanged={(e) => {
          if (e.selectedRowsData.length > 0) {
            setQuery(e.selectedRowsData[0].runQuery);
          } else {
            setQuery('');
          }
        }}
        showBorders={true}
        width={'100%'}
        height={'50%'}
        dataSource={dataSource}
        allowColumnResizing={true}
      >
        <Column
          dataField='eventDt'
          sortOrder='desc'
          caption={localizedString.log.date}
        />
        <Column
          dataField='eventTime'
          sortOrder='desc'
          caption={localizedString.log.time}
        />
        <Column
          dataField='reportType'
          caption={localizedString.log.reportType}
        />
        <Column
          dataField='reportNm'
          caption={localizedString.log.reportNm}
        />
        <Column
          dataField='userId'
          caption={localizedString.log.userId}
        />
        <Column
          dataField='userNm'
          caption={localizedString.log.userNm}
        />
        <Column
          dataField='grpNm'
          caption={localizedString.log.grpNm}
        />
        <Column
          dataField='accessIp'
          caption='IP'
        />
        <Column
          dataField='dsNm'
          caption={localizedString.log.dataSourceNm}
        />
        <Column
          dataField='dbNm'
          caption={localizedString.log.dbNm}
        />
        <Column
          dataField='dbmsType'
          caption={localizedString.log.dbmsType}
        />
        <Column
          dataField='runTime'
          caption={localizedString.log.eventTime}
        />
      </DataGrid>
      <Wrapper height='50%'>
        <ModalPanel
          title={localizedString.log.query}
          padding='10px 0px 0px 0px'
        >
          <AceEditor
            style={{
              borderRadius: '10px',
              border: '1px solid ' + theme.color.breakLine
            }}
            readOnly={true}
            placeholder=""
            mode="sql"
            theme="xcode"
            name="blah2"
            fontSize={14}
            width='100%'
            height='100%'
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={false}
            value={query}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: true,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2
            }}
          />
        </ModalPanel>
      </Wrapper>
    </Wrapper>
  );
};

export default QueryLog;
