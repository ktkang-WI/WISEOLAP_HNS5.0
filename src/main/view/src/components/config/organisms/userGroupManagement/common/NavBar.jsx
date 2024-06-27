import styled from 'styled-components';
import {Button} from 'devextreme-react';
import {getHint} from 'components/config/utility/utility.js';

export const Header = styled.div`
  flex: 0 0 50px;
  background-color:#e1e1e1;
`;

export const NavBar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: ${(props)=> props.direction ? props.direction : 'row'};
`;

export const NavBarItem = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 30px;
  padding: 0px 3px;
`;

export const navBarItems = ({
  btns,
  onClick
}) => {
  return (
    btns.map((item, index) => (
      <NavBarItem key={index}>
        <Button
          type="submit"
          icon={item}
          onClick={(e) => onClick(e, item)}
          hint={getHint(item)}
        />
      </NavBarItem>
    ))
  );
};
