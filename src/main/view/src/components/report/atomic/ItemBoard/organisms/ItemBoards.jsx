import styled from 'styled-components';
import ItemBoard from './ItemBoard';
import {getTheme} from 'config/theme';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import {useSelector} from 'react-redux';
import {selectReportLayout} from 'redux/selector/LayoutSelector';
import {
  selectCurrentReportId,
  selectReport
} from 'redux/selector/ReportSelector';
import {useDispatch} from 'react-redux';
import LayoutSlice from 'redux/modules/LayoutSlice';
import localizedString from 'config/localization';
import rename from 'assets/image/icon/button/modify.png';
import remove from 'assets/image/icon/button/remove.png';
import useModal from 'hooks/useModal';
import SimpleInputModal
  from 'components/common/atomic/Modal/organisms/SimpleInputModal';
import {selectEditMode} from 'redux/selector/ConfigSelector';
import {EditMode} from 'components/config/configType';
import {selectReportItem} from 'redux/selector/ItemSelector';
import ItemSlice from 'redux/modules/ItemSlice';

const theme = getTheme();

const CONTAINER_TAB_HEIGHT = theme.size.containerTabHeight || '35px';

const TabTitleWrapper = styled.div`
  height: auto;
  width: calc(100% - 10px);
  min-height: ${CONTAINER_TAB_HEIGHT};
  margin-bottom: 10px;
  display: flex;
  text-wrap: nowrap;
  flex-wrap: wrap;
`;

const StyledBoard = styled.div`
  height: 100%;
  width: calc(100% - 10px);
  flex: 1;
  background: ${theme.color.background};
  display: flex;
  flex-direction: column;
  min-height: 0px;
  margin-bottom: 0px;
`;

const ItemBoards = ({reportId}) => {
  const id = reportId || useSelector(selectCurrentReportId);
  const layout = useSelector((state) => selectReportLayout(state, id));
  const item = useSelector((state) => selectReportItem(state, id));
  const report = useSelector((state) => selectReport(state, id));
  const editMode = useSelector(selectEditMode);
  const dispatch = useDispatch();
  const {alert, openModal} = useModal();
  const tabEnabled = layout?.tabEnabled;
  const layoutConfig = Array.isArray(layout?.layoutConfig) ?
      layout?.layoutConfig : layout?.layoutConfig ? [layout?.layoutConfig] : [];

  const selectedTab = layout?.selectedTab || 0;

  const {selectTab, deleteContainerTab, updateTabTitle} = LayoutSlice.actions;
  const {deleteContainerItem} = ItemSlice.actions;

  const buttonOptions = {
    width: 'auto',
    height: CONTAINER_TAB_HEIGHT,
    font: theme.font.itemTitle,
    padding: '0px 15px'
  };

  const changeTab = (idx) => {
    dispatch(selectTab({reportId: id, tab: idx}));
  };

  const deleteTab = (e, idx) => {
    e.stopPropagation();

    if (layoutConfig.length == 1) {
      alert(localizedString.minContainerMsg);
      return;
    }

    dispatch(deleteContainerItem({reportId: id, tab: idx}));
    dispatch(deleteContainerTab({reportId: id, tab: idx}));
  };

  const renameTab = (e, title, idx) => {
    e.stopPropagation();
    openModal(SimpleInputModal, {
      modalTitle: localizedString.editContainerName,
      label: localizedString.containerName,
      defaultValue: title || localizedString.tab + 1,
      onSubmit: (newTitle) => {
        if (!newTitle) {
          alert(localizedString.blankContainerNameMsg);
          return true;
        }
        dispatch(updateTabTitle({reportId: id, title: newTitle, tab: idx}));
      }
    });
  };

  const generateTabHeaders = () => {
    return layoutConfig.map(({title}, i) => {
      const buttonCss = {
        marginLeft: '3px',
        marginBottom: '1px',
        width: '15px',
        height: '15px',
        filter: i == selectedTab ? 'brightness(0) invert(1)' : ''
      };

      return (
        <CommonButton
          key={'layout-' + i}
          onClick={() => changeTab(i)}
          margin='2px !important'
          {...(i != selectedTab?
            {
              background: 'white',
              type: 'secondary',
              border: '1px solid ' + theme.color.gray200
            } : {})
          }
          {...buttonOptions}
        >
          {title || localizedString.tab + 1}
          {
            editMode == EditMode.DESIGNER &&
            <>
              <img
                style={buttonCss}
                src={rename}
                onClick={(e) => renameTab(e, title, i)}
                title={localizedString.modify}
              />
              <img
                style={buttonCss}
                src={remove}
                onClick={(e) => deleteTab(e, i)}
                title={localizedString.remove}
              />
            </>
          }
        </CommonButton>
      );
    });
  };

  const generateBoards = () => {
    return layoutConfig.map((config, i) => {
      return (
        <ItemBoard
          key={'board' + i + '_' + report.reportId}
          report={report}
          className={'board-' + report.reportId + '-' + i}
          layoutConfig={config}
          item={item}
          style={{
            display: selectedTab == i ? 'block' : 'none'
          }}
        />);
    });
  };

  return (
    <StyledBoard
      id={'report' + id}
      className={'section board'}
    >
      {tabEnabled &&
        <TabTitleWrapper>
          {generateTabHeaders()}
        </TabTitleWrapper>
      }
      {generateBoards()}
    </StyledBoard>
  );
};

export default ItemBoards;
