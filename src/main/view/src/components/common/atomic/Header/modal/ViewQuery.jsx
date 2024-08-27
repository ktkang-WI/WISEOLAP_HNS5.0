import AceEditor from 'react-ace';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import Modal from '../../Modal/organisms/Modal';
import {SelectBox} from 'devextreme-react';
import styled from 'styled-components';
import {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import {
  selectCurrentItemsFunction,
  setDataSource,
  setQuery
} from './ViewQueryUtility';
import ModalPanelTitle from '../../Modal/atoms/ModalPanelTitle';
import useQueryExecute from 'hooks/useQueryExecute';
import {DesignerMode} from 'components/config/configType';

const theme = getTheme();

const Toolbar = styled.div`
  height: 50px;
  width: 100%;
  display: flex;
  align-items: baseline;
  flex-direction: row;
`;

const StyledDiv = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - 50px);
`;

const mode = (functionNm, designerMode, currentItems, name) => {
  switch (functionNm) {
    case 'setQuery':
      return setQuery(designerMode, currentItems, name);
    case 'setDataSource':
      return setDataSource(designerMode, currentItems);
    case 'currentItems':
      return selectCurrentItemsFunction(designerMode);
  }
};

const ViewQuery = ({...props}) => {
  const designerMode = useSelector(selectCurrentDesignerMode);
  // const {querySearch} = useReportSave();
  const {executeItems, executeSpread} = useQueryExecute();
  const [refresh, setRefresh] = useState(1);
  const currentItems = mode('currentItems', designerMode);
  const [defaultValue, setDefaultValue] = useState(
      () => mode('setDataSource', designerMode, currentItems)[0]);
  const [query, setQuery] = useState(
      () => mode('setQuery', designerMode, currentItems)
  );
  const editorRef = useRef(null);

  useEffect(() => {
    if (!query) {
      setQuery(() => mode('setQuery', designerMode, currentItems));
    }
  }, [refresh]);

  return (
    <Modal
      modalTitle={localizedString.showQuery}
      height={theme.size.bigModalHeight}
      width={theme.size.bigModalWidth}
      {...props}
      onSubmit={() => {
        return false;
      }}
    >
      <Toolbar>
        <ModalPanelTitle>
          {localizedString.showQuery}
        </ModalPanelTitle>
        {designerMode !== 'AdHoc' && <SelectBox
          width={'200px'}
          items={mode('setDataSource', designerMode, currentItems)}
          defaultValue={defaultValue}
          // value={defaultValue}
          onValueChange={(e) => {
            setQuery(() =>
              mode('setQuery', designerMode, currentItems, e));
            setDefaultValue([e]);
          }}
        />}
      </Toolbar>
      <StyledDiv>
        <AceEditor
          readOnly={true}
          ref={editorRef}
          mode="sql"
          theme="xcode"
          name="blah2"
          width='100%'
          height='100%'
          value={query}
          onLoad={async () => {
            if (DesignerMode['EXCEL'] !== designerMode) {
              await executeItems('showQuery');
            } else {
              await executeSpread('showQuery');
            }

            setRefresh((refresh) => refresh * -1);
          }}
        >
        </AceEditor>
      </StyledDiv>
    </Modal>);
};
export default ViewQuery;
