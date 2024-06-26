import React, {useRef} from 'react';
import ItemManager from '../util/ItemManager';
import useItemSetting from '../util/hook/useItemSetting';
import Sankey, {Tooltip, Link, Node} from 'devextreme-react/sankey';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

const SankeyChart = ({item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  const ref = useRef();
  if (!mart.init) {
    return <></>;
  }

  const {filterTools} = useItemSetting(item);
  const {setMasterFilterData} = filterTools;

  const customizeLinkTooltip = (info) => {
    return {
      html: `<b>From:</b> ${info.source}<br/><b>To:</b> ${info.target}<br/>`
    };
  };

  const onPointClick = ({target, component}) => {
    if (!interactiveOption.enabled) return;
    // 대상 차원이 차원일 경우
    if (interactiveOption.targetDimension == 'dimension') {
      setMasterFilterData(target.argument, () => {
        if (interactiveOption.mode == 'single') {
          if (target.isSelected()) {
            component.clearSelection();
            return;
          }
          component.clearSelection();
        }
        if (target.isSelected()) {
          component.getAllSeries().forEach((series) => {
            series.getPointsByArg(target.argument).forEach((point) => {
              point.clearSelection();
            });
          });
        } else {
          component.getAllSeries().forEach((series) => {
            series.getPointsByArg(target.argument).forEach((point) => {
              point.select();
            });
          });
        }
      });
    } else {
      // 대상 차원이 차원 그룹일 경우
      filterTools.setMasterFilterData(target.series.name, () => {
        if (interactiveOption.mode == 'single') {
          if (target.series.isSelected()) {
            component.clearSelection();
            return;
          }
          component.clearSelection();
        }
        if (target.series.isSelected()) {
          target.series.clearSelection();
        } else {
          target.series.select();
        }
      }, true);
    }
  };

  return (
    <Wrapper
      ref={ref}
    >
      <Sankey
        id='sankey'
        dataSource={mart.data.data}
        dataStructure={'plain'}
        palette={meta.palette.name}
        onPointClick={onPointClick}
        allowExpandAll={true}
        allowFiltering={true}
        allowSorting={true}
        allowSortingBySummary={true}
      >
        <Tooltip
          enabled={true}
          customizeLinkTooltip={customizeLinkTooltip}/>
        <Link colorMode='gradient'/>
        <Node width={8} padding={30}/>
      </Sankey>
    </Wrapper>
  );
};

export default React.memo(SankeyChart, ItemManager.commonPropsComparator);
