import {formatNumber, generateLabelSuffix}
  from 'components/utils/NumberFormatUtility';
import {Bullet, Tooltip} from 'devextreme-react/bullet';

const DataGridBullet = ({endScaleValue, value, column, displayValue}) => {
  const customizeTooltip = () => {
    const labelSuffix = generateLabelSuffix(column.format);
    const tooltipValue = formatNumber(displayValue, column.format, labelSuffix);

    return {
      text: tooltipValue
    };
  };

  return (
    <Bullet
      width={'100%'}
      color={'rgb(29, 178, 245)'}
      value={value}
      showTarget={false}
      showZeroLevel={false}
      onIncidentOccurred={null}
      startScaleValue={0}
      endScaleValue={endScaleValue}
    >
      <Tooltip customizeTooltip={customizeTooltip} />
    </Bullet>
  );
};

export default DataGridBullet;
