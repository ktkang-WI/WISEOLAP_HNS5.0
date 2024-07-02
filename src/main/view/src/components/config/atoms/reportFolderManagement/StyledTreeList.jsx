
import TreeList from 'devextreme-react/tree-list';
import styled from 'styled-components';

const StyledTreeList = styled(TreeList)`
  .dx-treelist-headers + .dx-treelist-rowsview {
    border-top: none;
  }
  .dx-treelist-header-panel {
    border-bottom: none;
  }

  .dx-treelist-nowrap {
    border: 1px solid var(--gray200);
    border-radius: 10px;
  }
`;

export default StyledTreeList;
