import styled from 'styled-components';
import CommonButton from '../../Common/Button/CommonButton';
import Wrapper from '../../Common/Wrap/Wrapper';
import {useState} from 'react';
import {List} from 'devextreme-react';
import {getTheme} from 'config/theme';
import localizedString from 'config/localization';

const theme = getTheme();
const ListFilterPopoverList = ({
  confirm,
  cancel,
  listRef,
  selectionKeys,
  allText='전체',
  info,
  orgDataSource = []
}) => {
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

  let selectionMode = info.multiSelect ? 'multiple' : 'single';

  if (selectionMode == 'multiple' && info.useAll) {
    selectionMode = 'all';
  }

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

    if (selectionMode == 'single' && info.useAll) {
      result.unshift({
        name: '[All]',
        caption: allText
      });
    }

    return result;
  };

  const [dataSource, setDataSource] = useState(
      () => sortDataSource(selectionKeys, orgDataSource));
  const [selection, setSelection] = useState(selectionKeys);
  const [searchValue, setSearchValue] = useState('');

  return (
    <Wrapper>
      <StyledList
        selectionMode={selectionMode}
        showSelectionControls={true}
        selectAllText={allText}
        selectAllMode={'page'}
        selectedByClick={true}
        height='200px'
        displayExpr='caption'
        keyExpr='name'
        ref={listRef}
        onOptionChanged={(e) => {
          if (e.name === 'searchValue') {
            setSearchValue(e.value);
          }
        }}
        onSelectionChanged={(e) => {
          const sKeys = e.component.option('selectedItemKeys');
          setDataSource(sortDataSource(sKeys));
          setSelection(sKeys);
        }}
        selectedItemKeys={selection}
        dataSource={dataSource}
        searchEnabled={info.useSearch}
        searchMode='contains'
        searchExpr={'caption'}
        searchValue={searchValue}
      >
      </StyledList>
      <Footer>
        <CommonButton type='primary' maxWidth='120px' onClick={confirm}>
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
