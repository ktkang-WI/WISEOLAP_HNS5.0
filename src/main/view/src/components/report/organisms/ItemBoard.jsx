import {styled} from 'styled-components';
import {Layout, Model} from 'flexlayout-react';
import 'flexlayout-react/style/light.css'; // Import the CSS styling
import ChartExample from './ChartExample';
import './itemBoard.css';
import download from '../../../assets/image/icon/button/download_new.png';

const StyledBoard = styled.div`
  height: 100%;
  width: 100%;
  flex: 1;
  background: #f5f6fa;
`;

const DownloadImage = styled.img`
  height: 20px;
  width: 20px;
`;

const ItemBoard = () => {
  const layoutConfig = {
    global: {tabEnableClose: false},
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

  function onRenderTabSet(tabSetNode, renderValues) {
    const tabNode = tabSetNode.getSelectedNode();
    if (tabNode) {
      renderValues.buttons.push(
          <button
            key="delete"
            title="Delete tabset"
            onClick={() => {
            }}
          >
          &#128473;&#xFE0E;
          </button>,
          <button
            key="download"
            title="Download"
            onClick={() => {
            }}
          >
            <DownloadImage src={download}/>
          </button>
      );
    }
  }

  return (
    <StyledBoard>
      <Layout model={Model.fromJson(layoutConfig)}
        factory={factory}
        onRenderTabSet={onRenderTabSet}
      />
    </StyledBoard>
  );
};


export default ItemBoard;
