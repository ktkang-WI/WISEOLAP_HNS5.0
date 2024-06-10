import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import {useNavigate} from 'react-router-dom';
import styled from 'styled-components';

const MenuPanel = styled.div`
`;

const commonProperties = {
  type: 'onlyImageText',
  width: 'inherit'
};

const MyPageMenuButtons = ({btns}) => {
  const nav = useNavigate();

  const makeButtons = (buttons) => {
    return buttons.map((btn) => {
      return (
        <MenuPanel key={btn.id}>
          <CommonButton
            id={btn.id}
            key={btn.id}
            {...commonProperties}
            onClick={() => {
              nav('/editds/myPage' + btn.path);
            }}
          >
            {btn.label}
          </CommonButton>
        </MenuPanel>
      );
    });
  };

  return (
    <>
      {makeButtons(btns)}
    </>
  );
};
export default MyPageMenuButtons;
