import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import Title from 'components/config/atoms/common/Title';
import styled from 'styled-components';

const StyledBtn = styled.button`
  position: absolute;
  right: 50px;
`;

const Panel = ({title, children, onClick, ...props}) => {
  return (
    <Wrapper
      overflow='hidden'
      display='flex'
      direction='column'
      {...props}
    >
      <Title title={title}>
        {props.useBtn &&
          // TODO: 추후 변경 예정.
          <StyledBtn onClick={onClick}>
            {props.label}
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
