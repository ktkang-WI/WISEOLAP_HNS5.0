import {Bullet, Tooltip} from 'devextreme-react/bullet';

const DataGridBullet = ({endScaleValue, value, column}) => {
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
