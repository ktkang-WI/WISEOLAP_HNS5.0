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
import {getContextMenu} from '../utils/contextMenu';

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
  background: ${theme.color.dataColumn};
  color: ${theme.color.primaryFont};
  height: ${theme.size.dataColumn};
  width: ${(props) => props.width};
  font: ${theme.font.dataColumn};
  border: 1px solid ${theme.color.dataColumnBorder};
  border-radius: 2px;
  line-height: calc(${theme.size.dataColumn} - 4px);
  text-align: center;
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
  &:hover {
    background: ${theme.color.dataColumn};
    border: 1px solid ${theme.color.dataColumnBorder};
  }
`;

const Arrow = styled.img `
    position: absolute;
    left: 7px;
    top: calc(50% - 7px);
    width: auto;
    height: 13px;
    ${(props) => props.direction == 'DESC' && 'transform: rotate(180deg);'}
`;

const OtherMenuButton = styled.img `
    position: absolute;
    right: 5px;
    top: calc(50% - 7px);
    width: auto;
    height: 13px;
    opacity: 0.6;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
`;

const DataColumn = ({
  data, children, provided, onClick, showContextMenu, type, useButton,
  buttonEvent, buttonIcon, sortOrder, fixed, sortItems, reportId, ...props
}) => {
  const otherMenuId = 'a' + uuid();
  const dispatch = useDispatch();
  const {openModal} = useModal();
  const {updateItemField} = ItemSlice.actions;

  const contextItemRender = (e) => {
    const checkIcon = '\u2713';
    const childrenIcon = '\u25B6';
    const iconStyle = {
      position: 'absolute',
      display: 'inline-block',
      right: '5px'
    };

    const expandIconStyle = {
      ...iconStyle,
      fontSize: '10px',
      top: 'calc(50% - 10px)'
    };

    const summaryType = data && data.type == 'MEA' ? data.summaryType : '';
    const sortBy = data && data.type == 'DIM' ? data.sortBy : '';

    return (
      <>
        <span className='dx-menu-item-text'>{e.text}</span>
        {(summaryType || sortBy) == e.value &&
          <div style={iconStyle}>{checkIcon}</div>}
        {e.items && <div style={expandIconStyle}>{childrenIcon}</div>}
      </>
    );
  };

  const contextMenuFunction = {
    'SummaryType': (e) => {
      dispatch(updateItemField({reportId,
        dataField: {...data, summaryType: e.itemData.value}}));
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
    'SortBy': (e) => {
      dispatch(updateItemField({reportId,
        dataField: {...data, sortBy: e.itemData.value}}));
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
        {type === 'DIM' &&
          <Arrow src={arrowImg} direction={sortOrder}/>
        }
        {children}
        {showContextMenu &&
          <OtherMenuButton id={otherMenuId} src={otherMenuImg}/>
        }
        {showContextMenu &&
          <ContextMenu
            className='other-menu'
            dataSource={getContextMenu(data, sortItems)}
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
          buttonEvent(data, e);
        }}>
          <IconImg src={buttonIcon}/>
        </Button>
      }
    </ColumnWrapper>
  );
};

export default DataColumn;
