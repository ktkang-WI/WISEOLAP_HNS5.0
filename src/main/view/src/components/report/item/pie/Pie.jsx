import {PieChart} from 'devextreme-react';
import {
  Connector,
  Label,
  Legend,
  Series,
  Size,
  Tooltip} from 'devextreme-react/pie-chart';
import customizeOption from './customizingPie/CustomizeOption';
import React, {useEffect, useRef} from 'react';
import {itemExportsObject}
  from 'components/report/atomic/ItemDownload/ItemDownload';

const Pie = ({setItemExports, id, item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  if (!mart.init) {
    return <></>;
  }
  const seriesMeasureNames = mart?.data.info.seriesMeasureNames;
  const dxRefs = useRef([]);

  useEffect(() => {
    // TODO: PIE 는 임시용 매개변수입니다.
    const itemExportObject =
      itemExportsObject(id, dxRefs.current, 'PIE', mart.data.data);

    setItemExports((prev) => {
      const itemExports =
        prev.filter((item) => item.id !== itemExportObject.id);
      return [
        ...itemExports,
        itemExportObject
      ];
    });
  }, [mart.data.data]);

  const getColor = () => {
    let pickedColor = null;

    if (meta.paletteType === 'colorEdit') {
      const palette = meta.colorEdit.map((color) => color.value);

      pickedColor = palette;
    } else {
      pickedColor = meta.palette?.colors;
    }
    return pickedColor;
  };

  const calculatePieStyles = (totalPies) => {
    let flex;
    let maxWidth;
    let height;
    if (totalPies === 1) {
      flex = '1 1 100%';
      maxWidth = '100%';
      height = '100%';
    } else if (totalPies === 2) {
      flex = '1 1 calc(50% - 10px)';
      maxWidth = 'calc(50% - 10px)';
      height = '400px';
    } else if (totalPies <= 4) {
      flex = '1 1 calc(50% - 10px)';
      maxWidth = 'calc(50% - 10px)';
      height = '300px';
    } else {
      flex = '1 1 calc(33.33% - 10px)';
      maxWidth = 'calc(33.33% - 10px)';
      height = '250px';
    }
    return {flex, maxWidth, height};
  };

  const renderPieChart = (dimension, idx) => (
    <>
      <PieChart
        id={id}
        ref={(ref) => (dxRefs.current[idx] = ref)}
        key={idx}
        type={meta.pieChartStyle}
        dataSource={mart.data.data}
        width={'calc(100%/'+'1'+')'}
        height={'100%'}
        style={{float: 'left'}}
        title={meta.labelEdit.showTitle ? dimension.caption : ''}
        animation={{
          duration: 1000,
          easing: 'easeOutCubic', // 애니메이션
          enabled: true
        }}
        palette={getColor()}
      >
        <Legend // 범례
          visible={meta.legend.useLegend}
          position={meta.legend.position}
          horizontalAlignment={meta.legend.horizontalAlignment}
          verticalAlignment={meta.legend.verticalAlignment}
          itemTextPosition={meta.legend.itemTextPosition}
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
    </>
  );

  return (
    <div
      style={{
        overflowY: 'auto',
        height: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        justifyContent: 'space-around',
        alignItems: 'flex-start'
      }}
    >
      {seriesMeasureNames.map((dimension, idx) => {
        const styles = calculatePieStyles(seriesMeasureNames.length);
        return (
          <div
            key={idx}
            style={{
              flex: styles.flex,
              maxWidth: styles.maxWidth,
              height: styles.height,
              boxSizing: 'border-box'
            }}
          >
            {renderPieChart(dimension, idx)}
          </div>
        );
      })}
    </div>
  );
};
export default React.memo(Pie);
