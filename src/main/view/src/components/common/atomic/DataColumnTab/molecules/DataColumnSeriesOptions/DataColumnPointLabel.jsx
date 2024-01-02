import {useState} from 'react';
import {LabelPanel} from './Common/LabelPanel';
import {LabelSelectBox} from './Common/LabelSelectBox';
import {pointLabelData}
  from '../../organism/DataColumnSeriesOptions/metaData/SeriesOptionData';


const DataColumnPointLabel = () => {
  const [pointLabel, setPointLabel] =
    useState(pointLabelData.pointLabel);

  const handleSelectBoxValueChanged = (e, id) => {
    console.log(pointLabel);
    setPointLabel((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          item.value = e.value;
        }
        return item;
      });
    });
  };

  return (
    <LabelPanel>
      {pointLabel.map((item, index) =>
        <LabelSelectBox
          onValueChanged={(e) => handleSelectBoxValueChanged(e, item.id)}
          key={index}
          value={item.value}
          items={item.items}
          label={item.label}
        />)}
    </LabelPanel>
  );
};

export const pointLabelDataStructure = {
  id: 0,
  label: '',
  value: ''
};

export default DataColumnPointLabel;
