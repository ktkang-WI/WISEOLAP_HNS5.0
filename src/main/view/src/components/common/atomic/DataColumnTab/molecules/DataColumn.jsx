import {styled} from 'styled-components';
import {getTheme} from 'config/theme';
import arrowImg
  from '../../../../../assets/image/icon/dataSource/sort_arrow.png';
import otherMenuImg
  from '../../../../../assets/image/icon/dataSource/other_menu.png';
import {ContextMenu} from 'devextreme-react';
import localizedString from '../../../../../config/localization';
import uuid from 'react-uuid';

const theme = getTheme();

const measureMenuItems = [
  {
    'text': localizedString.count
  },
  {
    'text': localizedString.distinctCount
  },
  {
    'text': localizedString.sum
  },
  {
    'text': localizedString.min
  },
  {
    'text': localizedString.max
  },
  {
    'text': localizedString.average
  },
  {
    'text': localizedString.format
  },
  {
    'text': localizedString.rename
  }
];

const dimensionMenuItems = [
  {
    'text': localizedString.sortBy,
    'items': [
      // TODO: 추후 redux로 교체
      {'text': '금액'},
      {'text': '소계'}
    ]
  },
  {
    'text': localizedString.topN
  },
  {
    'text': localizedString.rename
  }
];

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
  data, children, provided, onClick, showContextMenu, type,
  useButton, buttonEvent, buttonIcon, sortOrder, fixed, ...props
}) => {
  const otherMenuId = 'a' + uuid();
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
