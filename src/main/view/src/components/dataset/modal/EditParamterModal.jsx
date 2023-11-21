import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import ParameterList from '../atomic/molecules/ParameterList';
import localizedString from 'config/localization';
import ParameterInfoForm
  from '../atomic/molecules/ParameterModalForms/ParameterInfoForm';
import ModalPanelTitle
  from 'components/common/atomic/Modal/atoms/ModalPanelTitle';
import ParamterRendringOptionForm
  from '../atomic/molecules/ParameterModalForms/ParamterRendringOptionForm';
import {useState, useReducer} from 'react';
import _ from 'lodash';
import DetailOptionForm
  from '../atomic/molecules/ParameterModalForms/DetailOptionForm';
import ParamUtils from '../utils/ParamUtils';

const theme = getTheme();

const PARAM_LIST_WIDTH = '350px';
const INFO_HEIGHT = '350px';
const PADDING = '20';

const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: ${(props) => props.height || '100%'};
  width: ${(props) => props.width || '100%'};
  & > div + div {
    border-left: 1px solid ${theme.color.breakLine};
  }
  #calendar-option .dx-field-item-label-content {
    width: 180px !important;
  }
  .dx-field-item-label-content {
    width: 150px !important;
  }
`;

const ScrollableColumnWrapper = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: ${(props) => props.height || '100%'};
  width: ${(props) => props.width || '100%'};
  flex-flow: wrap;
`;

const HeightAutoModalPanel = styled.div`
  height: auto;
  min-height: ${(props) => props.minHeight};
  padding: ${PADDING + 'px'};
  box-sizing: border-box;
  width: 100%;
`;

const EditParamterModal = ({onClose, parameterInfo, onSubmit}) => {
  const [paramInfo, setParamInfo] = useState(parameterInfo);
  const [selectedParam, setSelectedParam] = useReducer(
      (prev, next) => {
        if (!next) {
          return {};
        }
        if (Object.keys(next).length > 1) {
          return next;
        }
        return {...prev, ...next};
      },
      {}
  );

  const getNewParamInfo = () => {
    const newParamInfo = paramInfo.map((info) => {
      if (selectedParam.name == info.name) {
        return selectedParam;
      }
      return info;
    });

    newParamInfo.sort((a, b) => a.order - b.order);

    return newParamInfo;
  };

  const detailOptionChanged = (e) => {
    if (e.dataField.indexOf('[') > 0) {
      const fieldInfo = e.dataField
          .substr(0, e.dataField.length - 1).split('[');
      const fieldName = fieldInfo[0];
      const index = fieldInfo[1];

      let value;

      if (selectedParam[fieldName]) {
        value = _.cloneDeep(selectedParam[fieldName]);
      } else {
        value = ['', ''];
      }

      if (value[index] == e.value) return;

      value[index] = e.value;

      setSelectedParam({[fieldName]: value});
      return;
    }

    setSelectedParam({[e.dataField]: e.value});
  };

  return (
    <Modal
      onSubmit={() => {
        let newParamInfo = paramInfo;

        if (!_.isEmpty(selectedParam)) {
          newParamInfo = getNewParamInfo();
        }

        newParamInfo.map((param) => ParamUtils.sanitizeParamInformation(param));

        onSubmit(newParamInfo);
      }}
      height={theme.size.bigModalHeight}
      width={theme.size.bigModalWidth}
      modalTitle={localizedString.editParameter}
      onClose={onClose}
    >
      <RowWrapper>
        <ModalPanel
          title={localizedString.parameterList}
          minHeight={'100%'}
          padding={PADDING}
          width={PARAM_LIST_WIDTH}
          height='100%'>
          <ParameterList
            compact={true}
            dataSource={paramInfo}
            d={selectedParam}
            selection={{mode: 'single'}}
            onSelectionChanged={(e) => {
              if (!_.isEmpty(selectedParam)) {
                const newParamInfo = getNewParamInfo();
                setParamInfo(newParamInfo);
              }

              if (selectedParam.name == e.selectedRowsData[0].name) return;

              if (e.selectedRowsData.length > 0) {
                setSelectedParam(e.selectedRowsData[0]);
              } else {
                setSelectedParam(false);
              }
            }}
          />
        </ModalPanel>
        <ScrollableColumnWrapper
          width={'calc(100% - ' + PARAM_LIST_WIDTH + ')'}>
          <RowWrapper height={INFO_HEIGHT}>
            <ModalPanel
              padding={PADDING}
              title={localizedString.parameterBasicInformation}
              width='50%'
              height={INFO_HEIGHT}>
              <ParameterInfoForm
                dataSource={selectedParam}
                onFieldDataChanged={(e) => {
                  setSelectedParam({[e.dataField]: e.value});
                }}
              />
            </ModalPanel>
            <ModalPanel
              padding={PADDING}
              title={localizedString.parameterRenderingOption}
              width='50%'
              height={INFO_HEIGHT}>
              <ParamterRendringOptionForm
                dataSource={selectedParam}
                onFieldDataChanged={(e) => {
                  setSelectedParam({[e.dataField]: e.value});
                }}
              />
            </ModalPanel>
          </RowWrapper>
          <HeightAutoModalPanel
            minHeight={'calc(100% - ' + INFO_HEIGHT + ')'}
          >
            <ModalPanelTitle>{localizedString.detailOption}</ModalPanelTitle>
            {!_.isEmpty(selectedParam) &&
              <DetailOptionForm
                onFieldDataChanged={detailOptionChanged}
                param={selectedParam}
              />
            }
          </HeightAutoModalPanel>
        </ScrollableColumnWrapper>
      </RowWrapper>
    </Modal>
  );
};

export default EditParamterModal;
