import {useContext, useEffect, useState} from 'react';
import {LabelPanel} from './Common/LabelPanel';
import {LabelSelectBox} from './Common/LabelSelectBox';
import {pointLabelData}
  from '../../organism/DataColumnSeriesOptions/metaData/SeriesOptionData';
import {DataColumnSeriesOptionsContext}
  from '../../organism/DataColumnSeriesOptions/DataColumnSeriesOptions';
import _ from 'lodash';
import {LabelTextBox} from './Common/LabelTextBox';

/*
Notation: 'None',
overlayMode: 'basic',
direction: 'basic'

*/

const DataColumnPointLabel = () => {
  const getContext = useContext(DataColumnSeriesOptionsContext);
  const [pointLabel, setPointLabel] = getContext.state.pointLabel;
  const pointLabelFormat = _.cloneDeep(pointLabel);
  const [pointLabelOptions, setPointLabelOptions] =
    useState(pointLabelData.pointLabel);

  useEffect(() => {
    setPointLabelOptions((prev) => {
      return prev.map((item) => {
        item.value = pointLabelFormat[item.name];
        return item;
      });
    });
  }, []);

  const handleSelectBoxValueChanged = (e, id) => {
    setPointLabelOptions((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          item.value = e.value;
          pointLabelFormat[item.name] = e.value;
        }
        return item;
      });
    });
    setPointLabel(pointLabelFormat);
  };

  const handleTextBoxValueChanged = (e, id, key) => {
    console.log(e);
    setPointLabelOptions((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          item[key] = e;
          pointLabelFormat[key] = e;
        }
        return item;
      });
    });
    setPointLabel(pointLabelFormat);
  };

  return (
    <LabelPanel>
      {pointLabelOptions.map((item, index) =>
        <LabelSelectBox
          onValueChanged={(e) => handleSelectBoxValueChanged(e, item.id)}
          key={index}
          value={pointLabelFormat[item.name]}
          items={item.items}
          label={item.label}
        />)}
      {
        pointLabelOptions[0].value == 'Top N 값' &&
        <>
          <LabelTextBox
            label={'TOP 표시 개수'}
            value={pointLabelFormat['top']}
            onValueChanged={(e) => handleTextBoxValueChanged(e, 0, 'top')}
          />
          <LabelTextBox
            label={'BOTTOM 표시 개수'}
            value={pointLabelFormat['bottom']}
            onValueChanged={(e) => handleTextBoxValueChanged(e, 0, 'bottom')}
          />
        </>
      }
    </LabelPanel>
  );
};

export const pointLabelDataStructure = {
  id: 0,
  label: '',
  value: ''
};

export default DataColumnPointLabel;
