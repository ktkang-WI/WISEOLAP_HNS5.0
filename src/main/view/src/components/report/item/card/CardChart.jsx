import {useRef} from 'react';
import styled from 'styled-components';

const CardBoard = styled.div`
  width: 100%;
  height: 100%;
  min-width: 160px;
  min-height: 230px;
  margin: 0 5px;
  background-color: #FAFAFA;
  border-radius: 10px;
  border: 1px solid #bdbdbd;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #818181;
  overflow: hidden;
  text-overflow: ellipsis; 
  white-space: nowrap;
  flex: 0 0 10%;
`;

const Content = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #818181;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 calc(90%);
`;

const CardChart = ({
  onClick,
  title,
  content,
  id
}) => {
  const ref = useRef();

  return (
    <CardBoard
      ref={ref}
      id={id}
      onClick={(e) => {
        e.ref = ref;
        return onClick(e, {
          title: title,
          content: content
        });
      }}>
      <Title>{title}</Title>
      <Content>{content}</Content>
    </CardBoard>
  );
};

export default CardChart;
