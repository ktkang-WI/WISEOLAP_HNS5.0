import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import {TreeView} from 'devextreme-react';

const theme = getTheme();

const Wrapper = styled.div`
  padding-top: 10px;
  background: ${theme.color.panelColor};
  height: 100%;
  width: 100%;
  display: inline-block;
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

const ReportListTab = ({width, ...props}) => {
  return (
    <Wrapper
      width={width}
    >
      <StyledTreeView
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
        {...props}
      />
    </Wrapper>
  );
};

export default ReportListTab;
