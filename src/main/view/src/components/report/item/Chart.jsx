import DevChart, {
  ArgumentAxis,
  Label,
  Legend,
  Series
} from 'devextreme-react/chart';

const populationData = [{
  arg: 1960,
  val: 3032019978
}, {
  arg: 1970,
  val: 3683676306
}, {
  arg: 1980,
  val: 4434021975
}, {
  arg: 1990,
  val: 5281340078
}, {
  arg: 2000,
  val: 6115108363
}, {
  arg: 2010,
  val: 6922947261
}, {
  arg: 2020,
  val: 7795000000
}];

const Chart = (props) => {
  console.log(props);
  return (
    <DevChart
      title="World Population by Decade"
      dataSource={populationData}
      width="100%"
      height="100%"
      id="chart"
    >

      <ArgumentAxis tickInterval={10}>
        <Label format="decimal" />
      </ArgumentAxis>

      <Series
        type="bar"
      />

      <Legend
        visible={false}
      />

    </DevChart>
  );
};

export default Chart;
