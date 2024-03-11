import {ResponsiveBoxPlot} from '@nivo/boxplot';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import * as d3 from 'd3';

const BoxPlot = ({item}) => {
  const mart = item ? item.mart : null;
  // const meta = item ? item.meta : null;

  if (!mart.init) {
    return <></>;
  }

  window.d3 = d3;

  return (
    <Wrapper id={item.id}>
      <ResponsiveBoxPlot
        id={item.id}
        data={mart.data.data}
        onClick={(datum, e) => {
          console.log(datum);
          console.log(e.target);
        }}
        margin={{top: 60, right: 140, bottom: 60, left: 60}}
        subGroupBy="subGroup"
        padding={0.12}
        enableGridX={true}
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '',
          legendOffset: 36,
          truncateTickAt: 0
        }}
        axisRight={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: '',
          legendOffset: 0,
          truncateTickAt: 0
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'group',
          legendPosition: 'middle',
          legendOffset: 32,
          truncateTickAt: 0
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'value',
          legendPosition: 'middle',
          legendOffset: -40,
          truncateTickAt: 0
        }}
        colors={{scheme: 'nivo'}}
        borderRadius={2}
        borderWidth={2}
        borderColor={{
          from: 'color',
          modifiers: [
            [
              'darker',
              0.3
            ]
          ]
        }}
        medianWidth={2}
        medianColor={{
          from: 'color',
          modifiers: [
            [
              'darker',
              0.3
            ]
          ]
        }}
        whiskerEndSize={0.6}
        whiskerColor={{
          from: 'color',
          modifiers: [
            [
              'darker',
              0.3
            ]
          ]
        }}
        motionConfig="stiff"
        legends={[
          {
            anchor: 'right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemWidth: 60,
            itemHeight: 20,
            itemsSpacing: 3,
            itemTextColor: '#999',
            itemDirection: 'left-to-right',
            symbolSize: 20,
            symbolShape: 'square',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000'
                }
              }
            ]
          }
        ]}
      />
    </Wrapper>
  );
};

export default BoxPlot;
