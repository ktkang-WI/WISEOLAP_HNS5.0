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
  line-height: ${theme.size.dataColumn};
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
  const {updateItemField} = ItemSlice.actions;

  const measureMenuItems = [
    {
      'text': localizedString.count,
      'value': 'COUNT',
      'type': 'SummaryType'
    },
    {
      'text': localizedString.distinctCount,
      'value': 'COUNTDISTINCT',
      'type': 'SummaryType'
    },
    {
      'text': localizedString.sum,
      'value': 'SUM',
      'type': 'SummaryType'
    },
    {
      'text': localizedString.min,
      'value': 'MIN',
      'type': 'SummaryType'
    },
    {
      'text': localizedString.max,
      'value': 'MAX',
      'type': 'SummaryType'
    },
    {
      'text': localizedString.average,
      'value': 'AVG',
      'type': 'SummaryType'
    },
    {
      'text': localizedString.format,
      'value': 'FORMAT'
    },
    {
      'text': localizedString.rename,
      'value': 'RENAME'
    }
  ];

  const dimensionMenuItems = [
    {
      'text': localizedString.sortBy,
      'items': [{
        text: 'Value',
        value: data? data.name : ''
      }].concat(sortItems)
    },
    {
      'text': localizedString.topN
    },
    {
      'text': localizedString.rename
    }
  ];

  return (
    <ColumnWrapper
      fixed={fixed}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      {...props}
    >
      <Column
        onClick={onClick}
        width={(useButton? 'calc(100% - 38px)' : '100%')}>
        {sortOrder &&
          <Arrow src={arrowImg} direction={sortOrder}/>
        }
        {children}
        {showContextMenu &&
          <OtherMenuButton id={otherMenuId} src={otherMenuImg}/>
        }
        {showContextMenu &&
          <ContextMenu
            className='other-menu'
            dataSource={type === 'DIM'? dimensionMenuItems : measureMenuItems}
            width={120}
            showEvent='click'
            target={'#' + otherMenuId}
            itemRender={(e) => {
              const icon = '\u2713';
              const iconStyle = {
                position: 'absolute',
                display: 'inline-block',
                right: '5px'
              };

              return (
                <>
                  <span className='dx-menu-item-text'>{e.text}</span>
                  {data.summaryType && data.summaryType == e.value &&
                    <div style={iconStyle}>{icon}</div>}
                </>
              );
            }}
            onItemClick={(e) => {
              console.log(e);
              if (e.itemData.type == 'SummaryType') {
                dispatch(updateItemField({reportId,
                  dataField: {...data, summaryType: e.itemData.value}}));
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
