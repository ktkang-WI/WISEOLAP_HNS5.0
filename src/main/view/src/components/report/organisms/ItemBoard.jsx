import {styled} from 'styled-components';
import {Layout, Model} from 'flexlayout-react';
import 'flexlayout-react/style/light.css'; // Import the CSS styling
import ChartExample from './ChartExample';
// import './itemBoard.css';

const StyledBoard = styled.div`
  height: 100%;
  width: 100%;
  flex: 1;
  background: #f5f6fa;
`;

const ItemBoard = () => {
  const layoutConfig = {
    global: {tabEnableClose: true},
    layout: {
      type: 'row',
      children: [
        {
          type: 'tabset',
          weight: 50,
          selected: 0,
          children: [
            {
              type: 'tab',
              name: 'Chart Tab 1',
              component: 'chart'
            }
          ]
        },
        {
          type: 'tabset',
          weight: 50,
          selected: 0,
          children: [
            {
              type: 'tab',
              name: 'Chart Tab 2',
              component: 'chart'
            }
          ]
        }
      ]
    }

  };

  function factory(node) {
    const component = node.getComponent();
    if (component === 'chart') {
      return <ChartExample/>;
    }
  }

  return (
    <StyledBoard>
      <Layout model={Model.fromJson(layoutConfig)}
        factory={factory}/>
    </StyledBoard>
  );
};


export default ItemBoard;
