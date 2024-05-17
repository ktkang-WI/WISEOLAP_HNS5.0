import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import {TreeView} from 'devextreme-react';
import React, {useRef, useCallback} from 'react';

const theme = getTheme();

const Wrapper = styled.div`
  padding-top: 10px;
  background: ${theme.color.panelColor};
  height: 100%;
  width: 100%;
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

const ReportListTab = ({title, width, height, onItemSelect, ...props}) => {
  const dxRef = useRef();
  let dblClick = 0;

  const handleItemClick = useCallback(
      async (e) => {
        dblClick ++;
        setTimeout(() => {
          dblClick--;
        }, 300);

        if (dblClick > 1) {
          if (!await props.onSubmit()) {
            props.onClose();
          };
        } else {
          if (onItemSelect) onItemSelect(e.itemData);
        }
      }, [onItemSelect]);
  return (
    <Wrapper
      width={width}
      height={height}
    >
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
