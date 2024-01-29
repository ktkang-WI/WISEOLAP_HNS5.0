import {useContext, useEffect, useState} from 'react';
import {ImgCheckBox} from './Common/ImgCheckBox';
import {dataColumnTypeData}
  from '../../organism/DataColumnSeriesOptions/metaData/SeriesOptionData';
import {DataColumnSeriesOptionsContext}
  from '../../organism/DataColumnSeriesOptions/DataColumnSeriesOptions';

const DataColumnType = () => {
  const getContext = useContext(DataColumnSeriesOptionsContext);
  const [type, setType] = getContext.state.type;
  const [dataColumnType, setDataColumnType] =
    useState(dataColumnTypeData.dataColumnType);

  useEffect(() => {
    dataColumnTypeCheckBoxCheck(type);
  }, []);

  const dataColumnTypeCheckBoxCheck = (type) => {
    setType(type);
    setDataColumnType((prev) => {
      const result = prev.map((item) => {
        return {
          ...item,
          checkboxs: item.checkboxs.map((checkbox, index) => {
            if (type === checkbox.type) {
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
