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

const ReportListTab = ({title, width, onItemSelect, ...props}) => {
  const dxRef = useRef();
  let dblClick = 0;

  const getReportTooltipMsg = (data) => {
    const writer = data.modUserName || data.regUserName || '';
    const requester = data.requester || '';
    let date = data.modDt || data.regDt || '';
    const tag = data.reportTag || '';
    const desc = data.reportDesc || '';

    if (date) {
      date = new Date(date).toLocaleString();
    }

    return `게시자: ${writer}\n요청자: ${requester}\n`+
      `최종수정일자: ${date}\n주석: ${tag}\n설명: ${desc}`;
  };

  const itemRender = (item) => {
    return (
      <div className="dx-item-content dx-treeview-item-content"
        title={item.type == 'REPORT' ? getReportTooltipMsg(item) : ''}
      >
        <img src={item.icon} className="dx-icon"/>
        <span>{item.name || item.fldNm}</span>
      </div>
    );
  };

  const handleItemClick = useCallback(
      async (e) => {
        dblClick ++;
        setTimeout(() => {
          dblClick--;
        }, 300);

        if (dblClick > 1) {
          if (!props.onClose) {
            props.onSubmit(e.itemData);
            props.dropdownBoxRef.current._instance.option('opened', false);
          } else {
            if (!await props.onSubmit()) {
              props.onClose();
            };
          }
        } else {
          if (onItemSelect) onItemSelect(e.itemData);
        }
      }, [onItemSelect]);

  return (
    <Wrapper
      width={width}
    >
      <StyledTreeView
        height={'calc(100% - 3px)'}
        ref={dxRef}
        dataStructure="plain"
        displayExpr="name"
        parentIdExpr="upperId"
        keyExpr="uniqueId"
        noDataText="조회된 보고서가 없습니다."
        searchEditorOptions={{
          placeholder: '검색'
        }}
        itemRender={itemRender}
        focusStateEnabled={true}
        onItemClick={handleItemClick}
        searchEnabled={true}
        {...props}
      >
      </StyledTreeView>
    </Wrapper>
  );
};

export default React.memo(ReportListTab);
