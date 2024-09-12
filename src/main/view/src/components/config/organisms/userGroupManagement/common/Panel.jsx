import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/common/Title';
import styled from 'styled-components';
import querySearchIcon from 'assets/image/icon/report/query_search.png';
import AddCommonBtn from 'components/common/atomic/Ribbon/atom/AddCommonBtn';

const StyledBtn = styled.span`
  position: absolute;
  right: 45px;
`;

const Panel = ({title, children, onClick, ...props}) => {
  const btn = {
    'id': 'query_search',
    'label': props.label,
    'type': 'CommonButton',
    'themeType': 'secondary',
    'icon': querySearchIcon,
    'width': '63px',
    'height': '30px',
    'useArrowButton': false,
    'onClick': () => {
      onClick();
    }
  };

  return (
    <Wrapper
      overflow='hidden'
      display='flex'
      direction='column'
      {...props}
    >
      <Title title={title}>
        {props.useBtn &&
          <StyledBtn>
            <AddCommonBtn item={btn}/>
          </StyledBtn>
        }
      </Title>
      <Wrapper height={'calc(100% - 40px)'}>
        {children}
      </Wrapper>
    </Wrapper>
  );
};

export default Panel;
