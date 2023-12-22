import {PieChart} from 'devextreme-react';
import {Connector, Label, Series, Size} from 'devextreme-react/pie-chart';

// const dummy = [{
//   country: 'Russia',
//   area: 12
// }, {
//   country: 'Canada',
//   area: 7
// }, {
//   country: 'USA',
//   area: 7
// }, {
//   country: 'China',
//   area: 7
// }, {
//   country: 'Brazil',
//   area: 6
// }, {
//   country: 'Australia',
//   area: 5
// }, {
//   country: 'India',
//   area: 2
// }, {
//   country: 'Others',
//   area: 55
// }];

const Pie = ({id, mart}) => {
  if (!mart.init) {
    return <></>;
  }
  const customizeText = (e) => { // utility로
    console.log(e);
    return e.argumentText;
  };
  return (
    <PieChart
      dataSource={mart.data.data} // mart
    >
      <Series
        argumentField='고객직업군' // 백단에서 가져오기.
        valueField='SUM_고객코드'
      >
        <Label visible={true}
          position='outside' // 옵션에 따라 바뀌게.
          customizeText={customizeText}
        >
          <Connector
            visible={true}
            width={1}
          />
        </Label>
      </Series>
      <Size width={500} />
    </PieChart>
  );
};
export default Pie;
