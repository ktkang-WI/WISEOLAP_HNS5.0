import {PieChart} from 'devextreme-react';
import {
  Connector,
  Label,
  Legend,
  Series,
  Size} from 'devextreme-react/pie-chart';

const Pie = ({id, item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  // console.log(mart);/
  if (!mart.init) {
    return <></>;
  }

  const customizeText = (e) => { // utility로
    console.log(e);
    return e.argumentText;
  };
  const seriesDimensionNames = mart?.data.info.seriesDimensionNames;
  console.log(mart);
  const pies = seriesDimensionNames.map((dimension, idx) => {
    return (
      <PieChart
        key={idx}
        type={meta.pieChartStyle}
        dataSource={mart.data.data} // mart
        width={'calc(100%/'+'1'+')'} // 가운데 변수 넣기.
        height={'100%'}
        style={{float: 'left'}}
        title={dimension}
        animation={{
          duration: 1000,
          easing: 'easeOutCubic', // 변경 가능하게.
          enabled: true
        }}
      >
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
          itemTextPosition="right"
          rowCount={2}
        />
        <Series
          argumentField='arg' // 백단에서 가져오기.
          valueField={dimension}
        >
          <Label visible={true}
            position={meta.labelPosition} // 옵션에 따라 바뀌게.
            customizeText={customizeText}
          >
            <Connector
              visible={true}
              width={0.5}
            />
          </Label>
        </Series>
        <Size width={'100%'} />
      </PieChart>
    );
  });
  return (
    <div style={{overflowY: 'auto', height: '100%'}}>
      {pies}
    </div>
  );
};
export default Pie;
