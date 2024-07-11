import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {getTheme} from 'config/theme';
import React, {createContext, useEffect, useRef, useState} from 'react';
import models from 'models';
import DataSourceAdditionContent from
  'components/config/molecules/dataSourceAddition/DataSourceAdditionContent';
import {DataSource} from 'models/dataset/DataSource';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import {getHint} from 'components/config/utility/utility';
import ConfigHeader from 'components/config/atoms/common/ConfigHeader';
import AddRibbonBtn from 'components/common/atomic/Ribbon/atom/AddRibbonBtn';
import {iconMapper} from '../common/ConfigUtility';

const theme = getTheme();

export const DataSourceAdditionContext = createContext();

const DataSourceAddition = () => {
  const {alert, confirm} = useModal();

  const [dataSource, setDataSource] = useState([]);
  const dataSourceListRef = useRef();
  const dataInformationRef = useRef();

  const context = {
    state: {
      dataSource: [dataSource, setDataSource]
    },
    ref: {
      dataSourceListRef: dataSourceListRef,
      dataInformationRef: dataInformationRef
    }
  };

  const validateAndProcess = (validate, process) => {
    if (validate.isValid) {
      process();
    } else {
      alert(localizedString.validationAlert);
    }
  };

  const init = () => {
    models.DataSource.getDs()
        .then((response) => {
          const newDs = response.data.data.reduce((acc, v) => {
            const dsIdList = acc.map((row) => row.dsId);
            if (!dsIdList.includes(v.dsId)) {
              const ds = new DataSource(v);
              acc.push(ds);
            }
            return acc;
          }, []);

          setDataSource(newDs);
          dataSourceListRef.current._instance.clearSelection();
        })
        .catch(() => {
          throw new Error('Data Loading Error');
        });
  };

  useEffect(() => {
    init();
  }, []);

  const btns = ['plus', 'save', 'remove'];

  const handleBtnClick = (e) => {
    const dsInfoFormData = dataInformationRef.current._instance
        .option('formData');
    const instance = new DataSource(dsInfoFormData);

    switch (e) {
      case 'plus':
        handlePlus();
        break;
      case 'save':
        handleSave({instance});
        break;
      case 'remove':
        handleRemove({instance});
        break;
      default:
        break;
    }
  };

  const handlePlus = () => {
    dataSourceListRef.current._instance.clearSelection();
  };

  const handleSave = ({instance}) => {
    const save = () => {
      const action = instance.dsId === 0 ?
        instance.createDs : instance.updateDs;
      const successMessage = instance.dsId === 0 ?
        localizedString.successSave : localizedString.successUpdate;
      action()
          .then((res) => {
            if (res.data.data) {
              init();
              alert(successMessage);
            }
          })
          .catch(() => {
            throw new Error('Failed Save Ds');
          });
    };

    validateAndProcess(dataInformationRef.current._instance.validate(), save);
  };

  const handleRemove = ({instance}) => {
    confirm(localizedString.dsDeleteMsg, () => {
      instance.deleteDs()
          .then((res) => {
            if (res.data.data) {
              init();
              alert(localizedString.successRemove);
            }
          })
          .catch(() => {
            throw new Error('Failed Remove Ds');
          });
    });
  };

  const navBarItems = () => {
    return (
      btns.map((item, index) => (
        <AddRibbonBtn
          key={index}
          item={{
            'imgSrc': iconMapper[item],
            'width': '60px',
            'onClick': () => handleBtnClick(item),
            'label': getHint(item)
          }}
        />
      ))
    );
  };

  return (
    <DataSourceAdditionContext.Provider
      value={context}>
      <Wrapper display='flex' direction='column'>
        <ConfigHeader>
          {navBarItems()}
        </ConfigHeader>
        <Wrapper
          style={{
            borderRadius: '10px',
            border: 'solid 1px ' + theme.color.breakLine,
            background: theme.color.panelColor,
            overflow: 'hidden',
            padding: '15px',
            marginLeft: '0px',
            marginTop: '10px'
          }}
        >
          <DataSourceAdditionContent/>
        </Wrapper>
      </Wrapper>
    </DataSourceAdditionContext.Provider>
  );
};

export default React.memo(DataSourceAddition);
