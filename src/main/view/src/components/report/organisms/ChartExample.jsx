import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
// import ItemHeader from '../molecules/ItemHeader';
import Chart, {
  ArgumentAxis,
  Label,
  Legend,
  Series
} from 'devextreme-react/chart';
import {styled} from 'styled-components';
import {getTheme} from 'config/theme';

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


const theme = getTheme();

const ItemWrapper = styled(Wrapper)`
  border: 1px solid ${theme.color.breakLine};
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const ItemContent = styled.div`
  width: 100%;
  height: 100%;
`;

// TODO: 추후 아이템별로 나눠야함.
const ChartExample = () => {
  return (
    <ItemWrapper>
      <ItemContent>
        <Chart
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

        </Chart>
      </ItemContent>
    </ItemWrapper>
  );
};

export default ChartExample;
