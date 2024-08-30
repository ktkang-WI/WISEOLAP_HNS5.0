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
    <ItemContent>데이터가 없거나, 보고서 조회가 필요합니다.</ItemContent>
  );
};

export default EmptyComponent;
