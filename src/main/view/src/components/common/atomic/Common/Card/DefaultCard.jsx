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
  overflow-y: scroll;
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

const generateForCard = (dataSource, columnNumber) => {
  const length = dataSource.length;
  const result = [];
  let temp = [];

  for (let index = 1; index <= length; index++) {
    const isThisLastColumn = (index % columnNumber) == 0;

    temp.push(dataSource[index - 1]);

    if (isThisLastColumn) {
      result.push(temp);
      temp = [];
    }
  };
  return result;
};

const autoCoulumnNumber = (autoCoulmn, width, columnNumber) => {
  if (!autoCoulmn) return columnNumber;
  const defaultColumnSize = [1, 2, 3, 4, 5];
  const returnColumnNumber = defaultColumnSize[Math.floor(width / 350)];
  return returnColumnNumber ? returnColumnNumber : 5;
};

const DefaultCard = ({
  dataSource,
  argumentField,
  valueFiled,
  width,
  columnNumber = 2,
  autoCoulmn = true
}) => {
  columnNumber = autoCoulumnNumber(autoCoulmn, width, columnNumber);
  const data = generateForCard(dataSource, columnNumber);

  return (
    <CardContainer>
      {
        data.map((row, i) => {
          return (
            <CardRow key={i}>
              <CardColumn>
                {
                  row.map((col, i) => {
                    const title = col[argumentField];
                    const content = col[valueFiled];
                    return (
                      <CardBoard key={i}>
                        <Title>{title}</Title>
                        <Content>{content}</Content>
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
