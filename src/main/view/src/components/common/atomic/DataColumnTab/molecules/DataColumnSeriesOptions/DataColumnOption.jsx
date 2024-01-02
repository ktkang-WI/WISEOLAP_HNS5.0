import {useState} from 'react';
import {LabelCheckBox} from './Common/LabelCheckBox';
import {LabelPanel} from './Common/LabelPanel';
import {generalOptionsData}
  from '../../organism/DataColumnSeriesOptions/metaData/SeriesOptionData';


const DataColumnOption = () => {
  const [generalOptions, setGeneralOptions] =
    useState(generalOptionsData);

  const handleCheckBoxValueChanged = (id) => {
    setGeneralOptions((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          item.checked = !item.checked;
        }
        return item;
      });
    });
  };

  return (
    <LabelPanel>
      {generalOptions.map((item, index) =>
        <LabelCheckBox
          onValueChanged={(e) => handleCheckBoxValueChanged(item.id)}
          key={index}
          label={item.label}
          checked={item.checked}
        />)}
    </LabelPanel>
  );
};

export const generalOptionDataStructure = {
  id: 0,
  label: '',
  checked: true
};

export default DataColumnOption;
