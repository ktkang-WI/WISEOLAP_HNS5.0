import {useState} from 'react';
import {ImgCheckBox} from './Common/ImgCheckBox';
import {dataColumnTypeData}
  from '../../organism/DataColumnSeriesOptions/metaData/SeriesOptionData';

const DataColumnType = () => {
  const [dataColumnType, setDataColumnType] =
    useState(dataColumnTypeData.dataColumnType);

  const dataColumnTypeCheckBoxCheck = (itemTitle) => {
    setDataColumnType((prev) => {
      const result = prev.map((item) => {
        return {
          ...item,
          checkboxs: item.checkboxs.map((checkbox, index) => {
            if (itemTitle === checkbox.title) {
              checkbox.checked = true;
            } else {
              checkbox.checked = false;
            }
            return {
              ...checkbox
            };
          })
        };
      });
      return result;
    });
  };

  const handleCheckBoxValueChanged = (e) => {
    dataColumnTypeCheckBoxCheck(e.target.id);
  };

  return (
    <div>
      {dataColumnType.map((item, index) =>
        <ImgCheckBox key={index}
          onValueChanged={(e) => handleCheckBoxValueChanged(e)}
          title={item.title} checkboxs={item.checkboxs} />)}
    </div>
  );
};

export const dataColumnType = {
  title: '',
  checkboxs: []
};

export const dataColumnTypes = {
  src: ''
};

export default DataColumnType;
