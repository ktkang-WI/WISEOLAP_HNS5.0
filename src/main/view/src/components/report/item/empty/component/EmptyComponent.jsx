import styled from 'styled-components';

const ItemContent = styled.h3`
  width: 100%;
  height: 100%;
  margin: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EmptyComponent = () => {
  return (
    // eslint-disable-next-line react/no-unescaped-entities
    <ItemContent>우측 상단에 '조회하기' 버튼을 눌러주세요.</ItemContent>
  );
};

export default EmptyComponent;
