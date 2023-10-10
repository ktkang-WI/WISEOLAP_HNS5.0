import {getTheme} from 'config/theme';
import {styled, css} from 'styled-components';
import Modal from '../../common/atomic/Modal/organisms/Modal';
import localizedString from '../../../config/localization';
import ModalPanel from '../../common/atomic/Modal/molecules/ModalPanel';
import Wrapper from '../../common/atomic/Common/Wrap/Wrapper';
import CommonDataGrid from '../../common/atomic/Common/CommonDataGrid';
import PageWrapper from '../../common/atomic/Modal/atoms/PageWrapper';
import CommonTextArea from '../../common/atomic/Common/CommonTextArea';
import {Column, Selection} from 'devextreme-react/data-grid';
import useModal from 'hooks/useModal';
import {useEffect, useState} from 'react';
import models from 'models';
import _ from 'lodash';


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
  const [dsViewList, setDsViewList] = useState([]);
  const [selectedCubeList, setSelectedCubeList] = useState([]);
  const [selectedCube, setSelectedCube] = useState({});
  const userId = 'admin';

  const {openModal} = useModal();

  useEffect(() => {
    // TODO: 추후 접속중인 유저 ID로 변경
    models.DSView.getByUserId(userId)
        .then((data) => {
          setDsViewList(data);
        });
  }, []);

  return (
    <Modal
      onSubmit={()=> {
        if (!_.isEmpty(selectedCube)) {
          onSubmit(selectedDataSource);
        } else {
          openModal(Alert, {
            message: '데이터 원본을 선택하지 않았습니다.'
          });
          return true;
        }
      }}
      modalTitle={localizedString.selectCube}
      height={theme.size.bigModalHeight}
      width={theme.size.bigModalWidth}
      {...props}
    >
      <PageWrapper>
        <StyledWrapper direction="row">
          <StyledWrapper width='50%' padding={padding}>
            <ModalPanel
              title={localizedString.dataSourceList}
            >
              <CommonDataGrid
                dataSource={dsViewList}
                onSelectionChanged={(e) => {
                  if (e.selectedRowsData.length > 0) {
                    models.Cube.getByDsViewId(userId,
                        e.selectedRowsData[0].dsViewId)
                        .then((data) => {
                          setSelectedCubeList(data);
                        });
                  } else {
                    setSelectedCubeList([]);
                  }
                }}
              >
                <Selection mode='single'/>
                <Column dataField='dsViewNm' caption='데이터원본 뷰 명'/>
                <Column dataField='dbNm' caption='데이터원본 명'/>
                <Column dataField='dbmsType' caption='DB 유형'/>
              </CommonDataGrid>
            </ModalPanel>
          </StyledWrapper>
          <StyledWrapper width='50%' padding={padding}>
            <ModalPanel height={'60%'} title={localizedString.cubeList}>
              <CommonDataGrid
                dataSource={selectedCubeList}
                onSelectionChanged={(e) => {
                  if (e.selectedRowsData.length > 0) {
                    setSelectedCube(e.selectedRowsData[0]);
                  } else {
                    setSelectedCube({});
                  }
                }}
              >
                <Selection mode='single'/>
                <Column dataField='cubeNm' caption='주제영역 명'/>
              </CommonDataGrid>
            </ModalPanel>
            <ModalPanel height={'40%'} title={localizedString.cubeComment}>
              <CommonTextArea
                value={_.isEmpty(selectedCube)? '' : selectedCube.cubeDesc}
              />
            </ModalPanel>
          </StyledWrapper>
        </StyledWrapper>
      </PageWrapper>
    </Modal>
  );
};

export default SelectCubeModal;
