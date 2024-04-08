import {useState} from 'react';
import styled from 'styled-components';
import CalendarImg from './calendar.jpg';
import CalendarImg2 from './calendar2.jpg';
import CalendarImg3 from './calendar3.jpg';

const PickUpBoard = styled.div`
  width: 100%;
  height: 100%;
  background: #f9f9f9;
`;

const PickUpItems = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const ItemImg = styled.img`
  width: 100%;
  height: 100%;
`;

const PickUpItem = styled.div`
  position: relative; 
  flex: 1;
  cursor: pointer;
  margin: 10px 5px 10px 5px;
  background-color: white;
  &:first-child {
    margin: 10px 5px 10px 10px;
  }
  &:last-child {
    margin: 10px 10px 10px 5px;
  }
`;

const Check = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 22px;
  height: 22px;
  border: 1px solid #b1b1b1;
  border-radius: 5px;
`;

const PickCalendar = ({
  items = [
    {
      key: 'item1',
      img: CalendarImg
    },
    {
      key: 'item2',
      img: CalendarImg2
    },
    {
      key: 'item3',
      img: CalendarImg3
    }
  ]
}) => {
  const [pickedItem, setPickedItem] = useState({
    index: 0,
    e: null
  });

  const handleItemClick = (e, index) => {
    setPickedItem({
      index: index,
      e: e
    });
  };

  return (
    <PickUpBoard>
      <PickUpItems>
        {items.map((item, index) => {
          return (
            <PickUpItem
              key={index}
              onClick={(e) => handleItemClick(e, index)}
            >
              {
                pickedItem?.index === index ? <Check>✔️</Check> : <></>
              }
              <ItemImg src={item.img}/>
            </PickUpItem>
          );
        })}
      </PickUpItems>
    </PickUpBoard>
  );
};

export default PickCalendar;
