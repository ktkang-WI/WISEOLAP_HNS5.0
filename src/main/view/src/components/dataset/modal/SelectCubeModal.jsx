import {getTheme} from 'config/theme';
import {styled, css} from 'styled-components';
import Modal from '../../common/atomic/Modal/organisms/Modal';
import localizedString from '../../../config/localization';
import ModalPanel from '../../common/atomic/Modal/molecules/ModalPanel';
import Wrapper from '../../common/atomic/Common/Wrap/Wrapper';
import CommonDataGrid from '../../common/atomic/Common/CommonDataGrid';
import PageWrapper from '../../common/atomic/Modal/atoms/PageWrapper';
import CommonTextArea from '../../common/atomic/Common/CommonTextArea';
import {Column} from 'devextreme-react/data-grid';
import useModal from 'hooks/useModal';
import {useEffect, useState} from 'react';
import models from 'models';

const theme = getTheme();

const padding = 5;

const StyledWrapper = styled(Wrapper)`
  display: flex;
  ${(props) => props.direction == 'row' ? css`
    flex-direction: row;
  ` : css`
    flex-direction: column;
  `}
  height: ${(props) => props.height || '100%'};
  width: ${(props) => props.width || '100%'};
  padding: ${(props) => props.padding || '0'}px;
`;

const SelectCubeModal = ({onSubmit, ...props}) => {
  const [selectedDataSource, setSelectedDataSource] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const {openModal} = useModal();

  useEffect(() => {
    // DS_SQL -> CUBE로
    models.DataSource.getByIdAndDsType('admin', 'DS_SQL')
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
          openModal(Alert, {
            message: '데이터 원본을 선택하지 않았습니다.'
          });
          return true;
        }
      }}
      page={1}
      usePage
      modalTitle={localizedString.selectCube}
      height={theme.size.middleModalHeight}
      width={theme.size.middleModalWidth}
      {...props}
    >
      <PageWrapper>
        <StyledWrapper direction="row">
          <StyledWrapper width='50%' padding={padding}>
            <ModalPanel
              title={localizedString.dataSourceList}
            >
              <CommonDataGrid
                dataSource={dataSource}
                onSelectionChanged={(e) => {
                  setSelectedDataSource(e.selectedRowsData[0]);
                }}
              >
                <Column dataField='dsNm' caption='데이터원본 뷰 명'/>
                <Column dataField='dbNm' caption='데이터원본 명'/>
                <Column dataField='dbmsType' caption='DB 유형'/>
              </CommonDataGrid>
            </ModalPanel>
          </StyledWrapper>
          <StyledWrapper width='50%' padding={padding}>
            <ModalPanel height={'60%'} title={localizedString.cubeList}>
              <CommonDataGrid dataSource={dataSource}>
                <Column dataField='State' caption='State'/>
                <Column dataField='State' caption='State'/>
              </CommonDataGrid>
            </ModalPanel>
            <ModalPanel height={'40%'} title={localizedString.cubeComment}>
              <CommonTextArea value={'test용'}/>
            </ModalPanel>
          </StyledWrapper>
        </StyledWrapper>
      </PageWrapper>
    </Modal>
  );
};

export default SelectCubeModal;
