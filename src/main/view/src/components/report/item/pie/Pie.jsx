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

const Pie = () => {
  return (
    <PieChart
      dataSource={[]} // mart
    >
      <Series
        argumentField="country"
        valueField="area"
      >
        <Label visible={true}>
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
