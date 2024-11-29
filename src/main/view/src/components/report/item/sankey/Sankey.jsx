import React, {useRef} from 'react';
import ItemManager from '../util/ItemManager';
import useItemSetting from '../util/hook/useItemSetting';
import Sankey, {Tooltip, Link, Node} from 'devextreme-react/sankey';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import useItemExport from 'hooks/useItemExport';
import ItemType from '../util/ItemType';
import {
  formatNumber,
  generateLabelSuffix
} from 'components/utils/NumberFormatUtility';

const SankeyChart = ({setItemExports, id, item}) => {
  const ref = useRef();

  const {filterTools, itemTools} = useItemSetting(item);
  const {setMasterFilterData} = filterTools;
  const {getDataField} = itemTools;
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;
  if (!mart.init) {
    return <></>;
  }

  useItemExport({
    id,
    ref,
    type: ItemType.SANKEY,
    data: mart?.data?.data,
    setItemExports});

  const format = getDataField()?.measure[0].format;

  const customizeLinkTooltip = ({source, target, weight}) => {
    const labelSuffix = generateLabelSuffix(format);
    const value = formatNumber(weight, format, labelSuffix);
    return {
      html: `<b>${source}-${target}</b><br/>${value}`
    };
  };

  const customizeNodeTooltip = ({label, weightIn, weightOut}) => {
    const weight = weightIn || weightOut;
    const labelSuffix = generateLabelSuffix(format);
    const value = formatNumber(weight, format, labelSuffix);
    return {
      html: `<b>${label}</b><br/>${value}`
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
        id={id}
        dataSource={mart.data.data}
        palette={meta.palette.name}
        onPointClick={onPointClick}
        allowExpandAll={true}
        allowFiltering={true}
        allowSorting={true}
        sourceField='source'
        targetField='target'
        weightField='weight'
        height={'100%'}
        allowSortingBySummary={true}
      >
        <Tooltip
          enabled={true}
          customizeNodeTooltip={customizeNodeTooltip}
          customizeLinkTooltip={customizeLinkTooltip}/>
        <Link colorMode='gradient'/>
        <Node width={8} padding={30}/>
      </Sankey>
    </Wrapper>
  );
};

export default React.memo(SankeyChart, ItemManager.commonPropsComparator);
