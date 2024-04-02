import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';

import React, {createContext, useEffect, useRef, useState} from 'react';
import {Button} from 'devextreme-react';
import styled from 'styled-components';
import models from 'models';
import DataSourceAdditionContent from
  'components/config/molecules/dataSourceAddition/DataSourceAdditionContent';
import {DataSource} from 'models/dataset/DataSource';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import {getHint} from 'components/config/utility/utility';

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
          console.log(response.data.data);
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

  const Header = styled.div`
  flex: 0 0 50px;
  background-color:#e1e1e1;
`;

  const Content = styled.div`
    width:100%;
    height:100%;
    display:flex;
    flex-direction: row;
    flex: 0 0 1;
  `;

  const NavBar = styled.div`
    width:100%;
    height:100%;
    display:flex;
    flex-direction: ${(props)=> props.direction ? props.direction : 'row'};
  `;

  const NavBarItem = styled.div`
    width:100%;
    height:100%;
    display:flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 30px;
    padding: 0px 3px;
  `;

  const handleBtnClick = ({component}) => {
    const icon = component.option('icon');
    const dsInfoFormData = dataInformationRef.current._instance
        .option('formData');
    const instance = new DataSource(dsInfoFormData);

    switch (icon) {
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
        <NavBarItem icon={item} key={index}>
          <Button
            icon={item}
            onClick={handleBtnClick}
            hint={getHint(item)}
          />
        </NavBarItem>
      ))
    );
  };

  return (
    <DataSourceAdditionContext.Provider
      value={context}>
      <Wrapper display='flex' direction='column'>
        <Header>
          <NavBar>
            {navBarItems()}
          </NavBar>
        </Header>
        <Content>
          <DataSourceAdditionContent/>
        </Content>
      </Wrapper>
    </DataSourceAdditionContext.Provider>
  );
};

export default React.memo(DataSourceAddition);
