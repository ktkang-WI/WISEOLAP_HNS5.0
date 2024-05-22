import AceEditor from 'react-ace';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import Modal from '../../Modal/organisms/Modal';
import ModalPanelTitle from '../../Modal/atoms/ModalPanelTitle';
import {SelectBox} from 'devextreme-react';
import styled from 'styled-components';
import {useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {selectCurrentDesignerMode} from 'redux/selector/ConfigSelector';
import {
  selectCurrentItemsFunction,
  setDataSource,
  setQuery
} from './ViewQueryUtility';

const theme = getTheme();

const SelectBoxSpan = styled.span`
  position: absolute;
  right: 10px;
  top: 55px;
`;

const StyledDiv = styled.div`
  padding: 15px;
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
  const currentItems = mode('currentItems', designerMode);
  const editorRef = useRef(null);
  const [defaultValue, setDefaultValue] = useState(
      () => mode('setDataSource', designerMode, currentItems)[0]);
  const [query, setQuery] = useState(
      () => mode('setQuery', designerMode, currentItems)
  );
  return (
    <Modal
      modalTitle={localizedString.showQuery}
      height={'calc(' + theme.size.bigModalHeightPx + ' -70px)'}
      width={'calc(' + theme.size.bigModalWidthPx + ' - 150px)'}
      {...props}
      onSubmit={() => {
        return false;
      }}
    >
      <ModalPanelTitle>
        {localizedString.showQuery}
        <SelectBoxSpan>
          {designerMode !== 'AdHoc' && <SelectBox
            width={'200px'}
            dataSource={mode('setDataSource', designerMode, currentItems)}
            defaultValue={defaultValue}
            onValueChange={(e) => {
              setQuery(() => mode('setQuery', designerMode, currentItems, e));
              setDefaultValue([e]);
            }}
          />}
        </SelectBoxSpan>
      </ModalPanelTitle>
      <StyledDiv>
        <AceEditor
          readOnly={true}
          ref={editorRef}
          mode="sql"
          theme="xcode"
          name="blah2"
          width='100%'
          value={query}
        >
        </AceEditor>
      </StyledDiv>
    </Modal>);
};
export default ViewQuery;
