import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import {TreeView} from 'devextreme-react';
import React, {useRef, useCallback} from 'react';
import {debounce} from 'lodash';

const theme = getTheme();

const Wrapper = styled.div`
  background: ${theme.color.panelColor};
  height: 100%;
  width: ${(props) => props.width || theme.size.panelWidth};
  display: inline-block;
  border: solid 1px ${theme.color.breakLine};
  text-align: left;
`;
const StyledTreeView = styled(TreeView)`
  color: ${theme.color.primaryFont};
  font: ${theme.font.dataSource};
  letter-spacing: -1px;
  .dx-treeview-toggle-item-visibility {
    color: ${theme.color.primaryFont};
  }
  .dx-treeview-item-content {
    transform: none !important;
  }
`;

// const Title = styled.div`
//   font-size: 16px; // Example title size, adjust as needed
//   color: ${theme.color.primaryFont};
//   padding: 0 10px; // Example padding, adjust as needed
//   margin-bottom: 10px; // Space between title and TreeView
// `;

const ReportListTab = ({title, width, height, onItemSelect, ...props}) => {
  const dxRef = useRef();
  const handleItemClick = useCallback(
      debounce((e) => {
        console.log('e.itemData', e.itemData);
        if (onItemSelect) onItemSelect(e.itemData);
      }, 300), [onItemSelect]);
  return (
    <Wrapper
      width={width}
      height={height}
    >
      {/* {title && <Title>{title}</Title>} */}
      <StyledTreeView
        ref={dxRef}
        dataStructure="plain"
        displayExpr="name"
        parentIdExpr="upperId"
        keyExpr="id"
        noDataText="조회된 보고서가 없습니다."
        searchEnabled={true}
        searchEditorOptions={{
          placeholder: '검색'
        }}
        focusStateEnabled={true}
        onItemClick={handleItemClick}
        {...props}
      />
    </Wrapper>
  );
};

export default React.memo(ReportListTab);
