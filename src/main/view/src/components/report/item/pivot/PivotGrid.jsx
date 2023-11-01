import DevPivotGrid from 'devextreme-react/pivot-grid';
import React from 'react';

const PivotGrid = ({id, mart}) => {
  if (!mart.init) {
    return <></>;
  }

  return (
    <DevPivotGrid
      width='100%'
      height='100%'
      id={id}
      dataSource={mart.dataSource}
    >
    </DevPivotGrid>
  );
};

export default React.memo(PivotGrid);
