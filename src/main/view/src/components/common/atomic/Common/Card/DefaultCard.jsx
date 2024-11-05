

import CardChart from 'components/report/item/card/CardChart';
import {splitRowsByColumnNumber}
  from 'components/report/item/util/dataCleanupUtility';
import {autoCoulumnNumber}
  from 'components/report/item/util/layoutUtility';
import styled from 'styled-components';

const CardContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(${(props) => props.columnNumber || '5'}, 1fr);
  gap: 10px;
  padding-left: 10px;
  overflow-y: auto;
  scrollbar-gutter: stable;
`;

// const CardRow = styled.div`
//   width: 100%;
//   margin: 5px 0;
//   height: 100%;
//   display: flex;
// `;

const DefaultCard = ({
  dataSource,
  argumentField,
  valueField,
  targetFields = [],
  width,
  height,
  onClick,
  columnNumber = 2,
  autoCoulmn = true,
  formats = [],
  selectedItem = []
}) => {
  columnNumber = autoCoulmn ? autoCoulumnNumber(4, width, 390) : columnNumber;
  const data = splitRowsByColumnNumber(dataSource, columnNumber);

  return (
    <CardContainer columnNumber={columnNumber} className='custom-scrollbar'>
      {
        data.map((row, i) => {
          return (
            row.map((col, i) => {
              const title = col[argumentField];
              const content = {
                value: col[valueField],
                format: formats[0]
              };

              const targets = targetFields.map((field, i) => {
                return {
                  key: field.caption,
                  value: col[field.summaryName],
                  format: formats[i + 1]
                };
              });

              const selected = selectedItem.find((item) => item == title);
              return (
                <CardChart
                  selected={selected}
                  key={i}
                  height={height ? height + 'px' : null}
                  title={title}
                  content={content}
                  targets={targets}
                  onClick={onClick}
                />
              );
            })
          );
        })
      }
    </CardContainer>
  );
};

export default DefaultCard;
