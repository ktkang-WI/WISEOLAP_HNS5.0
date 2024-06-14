import {generateColors} from 'devextreme/viz/palette';
import ItemType from './ItemType';

const colorOptions = {
  baseColorSet: 'simpleSet',
  paletteExtensionMode: 'blend'
};

const generateColorSize = (color, item) => {
  const size = color.length;
  let computedSize = 0;

  if ([ItemType.WATER_FALL, ItemType.HEAT_MAP].includes(item.type)) return 2;
  switch (item.type) {
    case ItemType.STAR_CHART:
      const measureSize =
        item?.mart?.data?.info?.seriesMeasureNames?.length || 0;
      computedSize = measureSize;
      break;
    case ItemType.SCATTER_PLOT:
      computedSize = item?.mart?.data?.info?.args?.length;
      break;
    case ItemType.LIQUID_FILL_GAUGE:
    case ItemType.ZOOMABLE_CICLE:
    case ItemType.SUNBURST_CHART:
    case ItemType.WORDCLOUD:
      computedSize = item?.mart?.data?.data?.length;
      break;
    default:
  };

  return size <= computedSize ? computedSize : size;
};

export const getBlendColor = ({
  color,
  item
}) => {
  const colorSize = generateColorSize(color, item);
  return generateColors(color, colorSize, colorOptions);
};
