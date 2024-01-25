import {PieChart} from 'devextreme-react';
import {
  Connector,
  Label,
  Legend,
  Series,
  Size,
  Tooltip} from 'devextreme-react/pie-chart';
import customizeOption from './customizingPie/CustomizeOption';
import React from 'react';

const Pie = ({item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  if (!mart.init) {
    return <></>;
  }

  const seriesDimensionNames = mart?.data.info.seriesDimensionNames;

  const pies = seriesDimensionNames.map((dimension, idx) => {
    return (
      <PieChart
        key={idx}
        type={meta.pieChartStyle}
        dataSource={mart.data.data} // mart
        width={'calc(100%/'+'1'+')'}
        height={'100%'}
        style={{float: 'left'}}
        title={meta.labelEdit.showTitle ? dimension.caption : ''}
        animation={{
          duration: 1000,
          easing: 'easeOutCubic', // 애니메이션
          enabled: true
        }}
      >
        <Legend // 범례
          visible={true}
          verticalAlignment="bottom"
          horizontalAlignment="center"
          itemTextPosition="right"
          rowCount={2}
        />
        <Tooltip
          enabled={true}
          contentRender={(e) => customizeOption(e, meta.tooltip, 'tooltip')}
        />
        <Series
          argumentField='arg'
          valueField={dimension.summaryName}
        >
          <Label visible={true}
            position={meta.labelPosition}
            customizeText={(e) => customizeOption(e, meta.labelEdit, 'label')}
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
export default React.memo(Pie);
