import {styled} from 'styled-components';
import {Layout, Model} from 'flexlayout-react';
import 'flexlayout-react/style/light.css'; // Import the CSS styling
import ChartExample from './ChartExample';
import './itemBoard.css';
import download from '../../../assets/image/icon/button/download_new.png';
import {useSelector} from 'react-redux';
import {useLocation} from 'react-router-dom';
import useLayout from 'hooks/useLayout';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import flexLayoutDefault from './FlexLayoutDefault';
import {useEffect} from 'react';
import {selectFlexLayoutConfig} from 'redux/selector/LayoutSelector';


const StyledBoard = styled.div`
  height: 100%;
  width: 100%;
  flex: 1;
  background: #f5f6fa;
  display: flex;
  min-height: 0px;
`;

const DownloadImage = styled.img`
  height: 20px;
  width: 20px;
`;

const ItemBoard = () => {
  const location = useLocation();
  const {defaultFlexLayout, deleteFlexLayout} = useLayout();
  const selectedReportId = useSelector(selectCurrentReportId);
  useEffect(() => {
    const defaultLayout = location.pathname.includes('dashboard')?
    flexLayoutDefault()['dashboard'] : flexLayoutDefault()['adhoc'];
    defaultFlexLayout(defaultLayout);
  }, [location]);
  const layoutConfig = useSelector(selectFlexLayoutConfig);

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
            onClick={(e) => {
              deleteFlexLayout(selectedReportId, tabNode._attributes.id);
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
