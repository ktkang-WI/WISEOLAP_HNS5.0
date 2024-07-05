import styled from 'styled-components';
import CommonButton from '../../Common/Button/CommonButton';
import Wrapper from '../../Common/Wrap/Wrapper';
import {useEffect, useState} from 'react';
import {List} from 'devextreme-react';
import {getTheme} from 'config/theme';
import localizedString from 'config/localization';

const theme = getTheme();

const StyledList = styled(List)`
  .dx-list-item-content {
    font: ${theme.font.filterContent};
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  height: 50px;
  flex-wrap: nowrap;
  align-items: flex-end;
  justify-content: center;
`;

const ListFilterPopoverList = ({
  confirm,
  cancel,
  listRef,
  selectionKeys,
  allText='전체',
  info,
  orgDataSource = []
}) => {
  // useEffect
  useEffect(() => {
    updateProps(selectionKeys);
  }, [selectionKeys, orgDataSource]);

  // local
  let selectionMode = info.multiSelect ? 'multiple' : 'single';
  const {useAll} = info;

  if (selectionMode === 'multiple' && useAll) {
    selectionMode = 'all';
  }

  // method
  const sortDataSource = (keys) => {
    const sortedDataSource = orgDataSource.reduce(
        (acc, item) => {
          if (keys.includes(item.name)) {
            acc.selected.push(item);
          } else {
            acc.others.push(item);
          }
          return acc;
        }, {selected: [], others: []});
    const result = [...sortedDataSource.selected, ...sortedDataSource.others];

    if (selectionMode === 'single' && useAll) {
      result.unshift({
        name: '[All]',
        caption: allText
      });
    }

    return result;
  };

  const updateProps = (sKeys) => {
    setSelection(sKeys);
    setDataSource(sortDataSource(sKeys));
  };

  const onOptionChanged = (e) => {
    if (e.name !== 'searchValue') return;

    const sKeys = e.component.option('selectedItemKeys');
    setSearchValue(e.value);
    updateProps(sKeys);
  };

  // state
  const [dataSource, setDataSource] = useState(sortDataSource(selectionKeys));
  const [selection, setSelection] = useState(selectionKeys);
  const [searchValue, setSearchValue] = useState('');

  return (
    <Wrapper>
      <StyledList
        selectionMode={selectionMode}
        showSelectionControls={true}
        selectAllText={allText}
        selectAllMode={searchValue!=''? 'page': 'allPage'}
        selectedByClick={true}
        height='200px'
        displayExpr='caption'
        keyExpr='name'
        ref={listRef}
        onOptionChanged={onOptionChanged}
        defaultSelectedItemKeys={selection}
        dataSource={dataSource}
        searchEnabled={info.useSearch}
        searchMode='contains'
        searchExpr={'caption'}
        searchEditorOptions={{
          valueChangeEvent: 'change'
        }}
        searchValue={searchValue}
      >
      </StyledList>
      <Footer>
        <CommonButton type='primary' maxWidth='120px' onClick={() => confirm()}>
          {localizedString.confirm}
        </CommonButton>
        <CommonButton type='secondary' maxWidth='120px' onClick={cancel}>
          {localizedString.cancel}
        </CommonButton>
      </Footer>
    </Wrapper>
  );
};

export default ListFilterPopoverList;
