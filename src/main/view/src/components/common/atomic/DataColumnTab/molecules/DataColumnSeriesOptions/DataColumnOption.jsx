import {useContext, useEffect, useState} from 'react';
import {LabelCheckBox} from './Common/LabelCheckBox';
import {LabelPanel} from './Common/LabelPanel';
import {generalOptionsData}
  from '../../organism/DataColumnSeriesOptions/metaData/SeriesOptionData';
import {DataColumnSeriesOptionsContext}
  from '../../organism/DataColumnSeriesOptions/DataColumnSeriesOptions';

const DataColumnOption = () => {
  const getContext = useContext(DataColumnSeriesOptionsContext);
  const [general, setGeneral] = getContext.state.general;
  // TODO: You have to change to selector of redux
  const generalFormat = _.cloneDeep(general);
  // TODO: After getting data You have initialIze value of checked
  const [generalOptions, setGeneralOptions] =
    useState(generalOptionsData);

  useEffect(() => {
    setGeneralOptions((prev) => {
      return prev.map((item) => {
        item.checked = generalFormat[item.name];
        return item;
      });
    });
  }, [getContext]);

  const handleCheckBoxValueChanged = (id) => {
    setGeneralOptions((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          const checkState = !item.checked;
          item.checked = checkState;
          generalFormat[item.name] = checkState;
        }
        return item;
      });
    });
    setGeneral(generalFormat);
  };

  return (
    <LabelPanel>
      {generalOptions.map((item, index) =>
        <LabelCheckBox
          onValueChanged={(e) => handleCheckBoxValueChanged(item.id)}
          key={index}
          label={item.label}
          checked={generalFormat[item.name]}
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
