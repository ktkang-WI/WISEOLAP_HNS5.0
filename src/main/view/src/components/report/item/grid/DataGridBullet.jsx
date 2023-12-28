import {Bullet} from 'devextreme-react/bullet';

const DataGridBullet = (cellData) => {
  return (
    <Bullet
      value={cellData.value}
    >
    </Bullet>
  );
};

export default DataGridBullet;
