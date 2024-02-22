import styled from 'styled-components';

const CardColumn = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const CardContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: scroll;
`;

const CardRow = styled.div`
  width: 100%;
  margin: 5px 0;
  height: 100%;
  display: flex;
`;

const CardBoard = styled.div`
  width: 100%;
  height: 100%;
  min-width: 200px;
  min-height: 250px;
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

const generateForCard = (dataSource, column) => {
  const length = dataSource.length;
  const result = [];
  let temp = [];

  for (let index = 1; index <= length; index++) {
    const isThisLastColumn = (index % column) == 0;

    temp.push(dataSource[index - 1]);

    if (isThisLastColumn) {
      result.push(temp);
      temp = [];
    }
  };
  return result;
};

const DefaultCard = ({dataSource, column}) => {
  const data = generateForCard(dataSource, column);

  return (
    <CardContainer>
      {
        data.map((row, i) => {
          return (
            <CardRow key={i}>
              <CardColumn>
                {
                  row.map((col, i) => {
                    return (
                      <CardBoard key={i}>
                        <Title>금액: 333,970,197,858123123123</Title>
                        <Content>1</Content>
                      </CardBoard>
                    );
                  })
                }
              </CardColumn>
            </CardRow>
          );
        })
      }
    </CardContainer>
  );
};

export default DefaultCard;
