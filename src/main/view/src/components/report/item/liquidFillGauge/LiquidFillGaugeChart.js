
import * as d3 from 'd3';
import styled from 'styled-components';
import D3LiquidFillGauge from './D3LiquidFillGauge';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;
const RowItem = styled.div`
  margin: 10px;
`;
const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const cleaningDataForChart = (
    dataSource,
    columnNumber
) => {
  const returnObject = [];
  let tempObject = [];
  dataSource.forEach((item, index) => {
    index = index + 1;
    const isOkToInit = (index % (columnNumber)) === 0;
    if (isOkToInit) {
      tempObject.push((item));
      returnObject.push(tempObject);
      tempObject = [];
    } else {
      tempObject.push((item));
    }
  });
  if (tempObject.length > 0) returnObject.push(tempObject);
  return returnObject;
};

const generateWidth = (width, columnNumber) => {
  let factor;
  if (columnNumber <= 2) {
    factor = 34;
  } else if (columnNumber <= 5) {
    factor = 20;
  } else if (columnNumber <= 10) {
    factor = 14;
  }
  return (width / columnNumber) - (columnNumber * 2) * (factor / columnNumber);
};

const autoCoulumnNumber = (autoCoulmn, width, columnNumber) => {
  if (!autoCoulmn) return columnNumber;
  const defaultColumnSize = [1, 2, 3, 4, 5, 6];
  const returnColumnNumber = defaultColumnSize[Math.floor(width / 200)];
  return returnColumnNumber ? returnColumnNumber : 7;
};

const getWidth = (dataSourceLengh, width, height, columnNumber) => {
  if (dataSourceLengh !== 1) {
    return [generateWidth(width, columnNumber), columnNumber];
  }
  if (width > height) {
    width = height - (height / 10);
  } else {
    width = width - (width / 3);
  }
  return [width, 1];
};

const LiquidFillGaugeChart = ({
  dataSource,
  valueField,
  argumentField,
  columnNumber = 5, // 최대 10
  autoCoulmn = true,
  width,
  height,
  palette,
  notationFormat
}) => {
  const [allocatedWidth, allocatedColumnNumber] =
    getWidth(
        dataSource.length,
        width,
        height,
        autoCoulmn ? autoCoulumnNumber(
            autoCoulmn,
            width,
            columnNumber
        ) : columnNumber
    );
  const totalValue = d3.sum(dataSource.map((item) => item[valueField]));
  const cleanedDataSource =
    cleaningDataForChart(dataSource, allocatedColumnNumber);
  let loopIndex = 0;
  return (
    <Container
    >
      {
        cleanedDataSource.map((parentItem, parentKey) => {
          return (
            <Row key={parentKey}>
              {
                parentItem.map((childrenItem, childrenKey) => {
                  const dimension =
                    childrenItem[argumentField].replaceAll('<br/>', ' - ');
                  const measure = childrenItem[valueField];
                  const percentage = (measure / totalValue) * 100;
                  loopIndex = loopIndex + 1;
                  return (
                    <RowItem
                      key={childrenKey}
                    >
                      <D3LiquidFillGauge
                        width={allocatedWidth}
                        elementId={childrenKey}
                        dimension={dimension}
                        measure={measure}
                        value={percentage}
                        color={palette.colors[loopIndex % 6]}
                        notationFormat={notationFormat}/>
                    </RowItem>
                  );
                })
              }
            </Row>
          );
        })
      }
    </Container>
  );
};

export default LiquidFillGaugeChart;
