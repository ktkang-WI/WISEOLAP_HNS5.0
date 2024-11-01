import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import {TreeView} from 'devextreme-react';
import React, {useRef, useCallback} from 'react';
import {preventInputSpecialChar} from 'components/useInfo/modal/Validations';
import {useNavigate} from 'react-router-dom';

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

const ReportListTab = (
    {title, width, onItemSelect, navigator, modalType, ...props}) => {
  const dxRef = useRef();
  let dblClick = 0;
  let nav = navigator;
  if (!navigator && modalType) {
    nav = useNavigate();
  }

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
            if (nav) {
              nav('/editds/' + e.itemData.reportType.toLowerCase());
            }
            props.onSubmit(e.itemData);
            props.dropdownBoxRef.current._instance.option('opened', false);
          } else {
            if (nav) {
              nav('/editds/' + e.itemData.reportType.toLowerCase());
            }
            if (!await props.onSubmit()) {
              props.onClose();
            };
          }
        } else {
          if (onItemSelect) onItemSelect(e.itemData);
        }
      }, [onItemSelect]);

  // paste 이벤트 처리: 붙여넣기 시 마지막 공백을 제거
  const handleSearchValueChanged = (e) => {
    if (e.value?.includes('\\')) {
      e.value = '';
      dxRef.current.instance.option('searchValue', e.value);
      return;
    }

    const event = e.event.originalEvent || {};
    let searchValue = e.value || '';

    if (event.inputType === 'insertFromPaste') {
      searchValue = searchValue.replace(/\s+$/, '');
    }

    dxRef.current.instance.option('searchValue', searchValue);
  };

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
        searchExpr='searchTarget'
        searchEditorOptions={{
          placeholder: '검색',
          onValueChanged: handleSearchValueChanged,
          onKeyDown: preventInputSpecialChar
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
