import {Bullet, Tooltip} from 'devextreme-react/bullet';

const DataGridBullet = (
    {component, value, column}) => {
  const dataSource = component.option('dataSource');

  const endScaleValue =
  Math.max.apply(null, dataSource.map((data) => data[column.name]));

  const customizeTooltip = () => {
    return {
      text: column.name + ': ' + value
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
