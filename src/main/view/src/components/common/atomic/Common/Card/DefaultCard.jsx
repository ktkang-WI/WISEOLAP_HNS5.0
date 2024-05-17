

import CardChart from 'components/report/item/card/CardChart';
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

const DefaultCard = ({
  dataSource,
  argumentField,
  valueFiled,
  width,
  onClick,
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
                      <CardChart
                        key={i}
                        title={title}
                        content={content}
                        onClick={onClick}
                      />
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
