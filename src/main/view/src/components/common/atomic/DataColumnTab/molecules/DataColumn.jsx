import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import arrowImg
  from '../../../../../assets/image/icon/dataSource/sort_arrow.png';
import otherMenuImg
  from '../../../../../assets/image/icon/dataSource/other_menu.png';
import {ContextMenu} from 'devextreme-react';
import localizedString from 'config/localization';
import uuid from 'react-uuid';
import ItemSlice from 'redux/modules/ItemSlice';
import {useDispatch} from 'react-redux';
import useModal from 'hooks/useModal';
import SimpleInputModal from '../../Modal/organisms/SimpleInputModal';
import NumberFormatModal
  from 'components/report/atomic/Format/organisms/NumberFormatModal';
import {getContextMenu} from '../utils/contextMenu';
import DataColumnSeriesOptions
  from '../organism/DataColumnSeriesOptions/DataColumnSeriesOptions';
import TopBottomModal from '../modal/TopBottomModal';

const theme = getTheme();

const ColumnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: ${theme.size.dataColumn};
  margin: 5px;
  ${(props) => props.fixed &&
  'transform: none !important;'}
  
`;

const Column = styled.div`
  background: ${theme.color.white};
  color: ${theme.color.gray600};
  height: ${theme.size.dataColumn};
  width: ${(props) => props.width};
  font: ${theme.font.dataColumn};
  border: 1px solid ${theme.color.gray200};
  border-radius: 4px;
  line-height: ${theme.size.dataColumn};
  text-align: left;
  padding-left: ${(props) => props.sortOrder ? '27px' : '12px'};
  padding-right: 20px;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const IconImg = styled.img`
  width: 25px;
  height: auto;
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 35px;
  border: 1px solid ${theme.color.gray200};
  border-radius: 4px;
`;

const Arrow = styled.img `
    position: absolute;
    left: 7px;
    top: calc(50% - 8px);
    width: auto;
    height: 16px;
    ${(props) => props.direction == 'DESC' && 'transform: rotate(180deg);'}
`;

const OtherMenuButton = styled.img `
    position: absolute;
    right: 5px;
    top: calc(50% - 8px);
    width: auto;
    height: 16px;
    cursor: pointer;
`;

const EllipsisSpan = styled.span`
  display: block;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const DataColumn = ({
  data,
  children,
  provided,
  onClick,
  showContextMenu,
  type,
  useButton,
  buttonEvent,
  buttonIcon,
  sortOrder,
  fixed,
  sortItems,
  reportId,
  itemType,
  ...props
}) => {
  const otherMenuId = 'a' + uuid();
  const dispatch = useDispatch();
  const {openModal} = useModal();
  const {updateItemField} = ItemSlice.actions;

  const contextItemRender = (e) => {
    const checkIcon = '\u2713';

    const summaryType = data?.type == 'MEA' ? data.summaryType : '';
    const sortBy = data?.type == 'DIM' ? data.sortBy : '';
    const summaryWay = data?.summaryWayEach ||
      typeof data.summaryWayEach == 'undefined' ? 'SUMMARY_WAY' : '';

    const useCheckIcon = [summaryType, sortBy, summaryWay].includes(e.value);

    return (
      <>
        <span className='dx-menu-item-text'>
          {useCheckIcon && checkIcon + ' '}
          {e.text}
        </span>
      </>
    );
  };

  const contextMenuFunction = {
    'SummaryType': (e) => {
      dispatch(updateItemField({reportId,
        dataField: {...data, summaryType: e.itemData.value}}));
    },
    'SummaryWay': () => {
      let summaryWayEach = data.summaryWayEach;
      if (typeof summaryWayEach == 'undefined') {
        summaryWayEach = true;
      }
      dispatch(updateItemField({reportId,
        dataField: {...data, summaryWayEach: !summaryWayEach}}));
    },
    'Rename': (e) => {
      openModal(SimpleInputModal, {
        modalTitle: localizedString.editFieldName,
        label: localizedString.fieldName,
        defaultValue: data.caption,
        onSubmit: (caption) => {
          dispatch(updateItemField({reportId,
            dataField: {...data, caption: caption}}));
        }
      });
    },
    'Format': (e) => {
      openModal(NumberFormatModal, {
        dataField: data,
        reportId: reportId
      });
    },
    'SortBy': (e) => {
      dispatch(updateItemField({reportId,
        dataField: {...data, sortBy: e.itemData.value}}));
    },
    'TopN': (e) => {
      openModal(TopBottomModal, {
        data,
        onSubmit: (topBottom) => {
          dispatch(updateItemField({reportId,
            dataField: {...data, topBottom}}));
        }
      });
    }
  };

  const buttonEventFunction = (e) => {
    if (data.category === 'field') {
      buttonEvent(data, openModal);
    } else if (
      data.category === 'measure' ||
      data.category === 'range1'
    ) {
      const fieldId = data.fieldId;
      openModal(DataColumnSeriesOptions, {
        fieldId
      });
    } else {
      buttonEvent(data, e);
    }
  };

  return (
    <ColumnWrapper
      fixed={fixed}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      {...props}
    >
      <Column
        title={children}
        sortOrder={sortOrder}
        onClick={(e) => {
          if (sortOrder && e.target.tagName != 'IMG' &&
              e.target.className.indexOf('dx-menu') == -1) {
            dispatch(updateItemField({reportId,
              dataField: {
                ...data,
                sortOrder: sortOrder == 'ASC'? 'DESC' : 'ASC'
              }}));
          }
        }}
        width={(useButton? 'calc(100% - 38px)' : '100%')}>
        {data?.type === 'DIM' &&
          <Arrow src={arrowImg} direction={sortOrder}/>
        }
        <EllipsisSpan>{children}</EllipsisSpan>
        {showContextMenu &&
          <OtherMenuButton id={otherMenuId} src={otherMenuImg}/>
        }
        {showContextMenu &&
          <ContextMenu
            className='other-menu'
            dataSource={getContextMenu(itemType, data, sortItems)}
            width={120}
            showEvent='click'
            target={'#' + otherMenuId}
            itemRender={contextItemRender}
            onItemClick={(e) => {
              const func = contextMenuFunction[e.itemData.type];
              if (func) {
                func(e);
              }
            }}
          />
        }
      </Column>
      {useButton &&
        <Button onClick={(e) => {
          // buttonEvent(data, e);
          buttonEventFunction(e);
        }}>
          <IconImg src={buttonIcon}/>
        </Button>
      }
    </ColumnWrapper>
  );
};

export default DataColumn;
