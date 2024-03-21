

import {splitRowsByColumnNumber}
  from 'components/report/item/util/dataCleanupUtility';
import {autoCoulumnNumber}
  from 'components/report/item/util/layoutUtility';
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

const DefaultCard = ({
  dataSource,
  argumentField,
  valueFiled,
  width,
  columnNumber = 2,
  autoCoulmn = true
}) => {
  columnNumber = autoCoulmn ? autoCoulumnNumber(4, width, 390) : columnNumber;
  const data = splitRowsByColumnNumber(dataSource, columnNumber);

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
