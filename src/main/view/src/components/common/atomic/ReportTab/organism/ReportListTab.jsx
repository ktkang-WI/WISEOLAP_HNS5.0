import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import {TreeView} from 'devextreme-react';

const theme = getTheme();

const Wrapper = styled.div`
  background: ${theme.color.panelColor};
  height: 100%;
  width: ${(props) => props.width || theme.size.panelWidth};
  display: inline-block;
  border-right: solid 1px ${theme.color.breakLine};
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
