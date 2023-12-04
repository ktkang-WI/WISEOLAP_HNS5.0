import CommonDataGrid from 'components/common/atomic/Common/CommonDataGrid';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {Column, Selection} from 'devextreme-react/data-grid';
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

const SelectDataSourceModal = ({onSubmit, ...props}) => {
  const [selectedDataSource, setSelectedDataSource] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const {alert} = useModal();

  useEffect(() => {
    models.DataSource.getByIdAndDsType('admin', DatasetType.DS_SQL)
        .then((data) => {
          setDataSource(data);
        });
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
          <CommonDataGrid
            width='100%'
            dataSource={dataSource}
            onSelectionChanged={(e) => {
              setSelectedDataSource(e.selectedRowsData[0]);
            }}
          >
            <Selection mode='single'/>
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
