import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {Column, Selection} from 'devextreme-react/data-grid';
import {RadioGroup} from 'devextreme-react';
import {useEffect, useState} from 'react';
import useModal from 'hooks/useModal';
import _ from 'lodash';
import DataSourceInfoForm from '../atomic/molecules/DataSourceInfoForm';
import models from 'models';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import {styled} from 'styled-components';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import localizedString from '../../../config/localization';
import {getTheme} from 'config/theme';
import DatasetType from '../utils/DatasetType';

const theme = getTheme();

const StyledWrapper = styled(Wrapper)`
  display: flex;
`;

const SelectDataSourceModal = ({onSubmit, isSingleTable, ...props}) => {
  const [selectedDataSource, setSelectedDataSource] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const [dsViewList, setDsViewList] = useState([]);
  const {alert} = useModal();

  const dsType = [
    {id: 'ds', text: localizedString.dataSource},
    {id: 'dsView', text: localizedString.dsView}
  ];

  const isDsSingleTable = isSingleTable ? isSingleTable : false;

  const [dataSourceType, setDataSourceType] = useState('ds');

  useEffect(() => {
    models.DataSource.getByIdAndDsType(DatasetType.DS_SQL)
        .then(({data}) => {
          setDataSource(data);
        }).catch((e) => {
          console.log(e);
        });
    if (isDsSingleTable) {
      models.DSView.getByUserId()
          .then((data) => {
            setDsViewList(data.data);
          }).catch((e) => {
            console.log(e);
          });
    }
  }, []);

  return (
    <Modal
      onSubmit={()=> {
        if (!_.isEmpty(selectedDataSource)) {
          onSubmit(selectedDataSource);
        } else {
          alert(localizedString.dataSourceNotSelectedMsg);

          return true;
        }
      }}
      height={theme.size.bigModalHeight}
      width={theme.size.bigModalWidth}
      modalTitle={localizedString.selectDataSource}
      {...props}
    >
      <StyledWrapper>
        <ModalPanel
          title={localizedString.selectDataSource}
          width='50%'
          padding='10'>
          <RadioGroup
            onValueChanged={(e) => {
              console.log(e);
              setDataSourceType(e.value);
            }}
            valueExpr={'id'}
            displayExpr={'text'}
            value={dataSourceType}
            items={dsType}
            visible={isDsSingleTable}/>
          <CommonDataGrid
            width='100%'
            dataSource={dataSourceType == 'ds' ? dataSource : dsViewList}
            onSelectionChanged={(e) => {
              setSelectedDataSource(e.selectedRowsData[0]);
            }}
          >
            <Selection mode='single'/>
            <Column caption={localizedString.dsViewName}
              visible={dataSourceType == 'dsView'} dataField='dsViewNm'/>
            <Column caption={localizedString.dataSourceName} dataField='dsNm'/>
            <Column caption={localizedString.dbType} dataField='dbmsType'/>
            <Column caption={localizedString.dbAddress} dataField='ip'/>
            <Column caption={localizedString.userData} dataField='userAreaYn'/>
          </CommonDataGrid>
        </ModalPanel>
        <ModalPanel
          title={localizedString.dataSourceInfo}
          width='50%'
          padding='10'>
          <DataSourceInfoForm
            selectedDataSource={selectedDataSource}
            height='100%'
            width='100%'
          />
        </ModalPanel>
      </StyledWrapper>
    </Modal>
  );
};

export default SelectDataSourceModal;
