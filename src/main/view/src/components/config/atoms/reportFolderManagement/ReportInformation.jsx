import Panel from
  'components/config/organisms/userGroupManagement/common/Panel';
import Form, {
  Label, RequiredRule, SimpleItem
} from 'devextreme-react/form';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import FolderListModal from './modal/FolderListModal';
import {useRef} from 'react';
import {getFullUrl} from 'components/common/atomic/Location/Location';
import {DesignerMode} from 'components/config/configType';

const ReportInformation = ({row, setRow, flag}) => {
  const ref = useRef();
  const {openModal} = useModal();

  const selectedReportExecute = () => {
    const formData = ref.current.props;
    const reportId = formData.formData.reportId;
    const reportType = formData.formData.reportType;
    const prompt = formData.formData.promptYn;

    if (formData.formData.length === 0) return;
    if (reportId === 0) return;
    if (!reportType) return;

    const reportPosision = formData.formData.reportType.toLowerCase();

    window.sessionStorage.setItem('flag', 'reportManagement');
    window.sessionStorage.setItem('reportId', reportId);
    window.sessionStorage.setItem('reportType', reportType);
    window.sessionStorage.setItem('prompt', prompt.toString());

    const newWindow =
      window.open(`${getFullUrl()}/${reportPosision}`, '_blank');

    if (newWindow) {
      newWindow.focus();
    }

    window.sessionStorage.clear();
  };

  const folderSearchBtn = {
    name: 'folderSearchBtn',
    location: 'after',
    options: {
      visible: true,
      stylingMode: 'text',
      icon: 'search',
      type: 'default',
      disabled: false,
      onClick: (e) => {
        openModal(FolderListModal, {
          row: row,
          setRow: setRow,
          type: 'report'
        });
      }
    }
  };

  return (
    <Panel
      title={localizedString.reportInformation}
      onClick={() => {
        if (flag) {
          selectedReportExecute();
        }
      }}
      // TODO : 추후 공용 보고서도 보고서 실행 개발 예정.
      useBtn={flag ? true : false}
      label={localizedString.execute}
    >
      <Form
        ref={ref}
        formData={row}
        style={{
          marginTop: '0px',
          overflow: 'auto'
        }}
        height={'100%'}
        elementAttr={{
          class: 'report-information dx-fieldset custom-scrollbar'
        }}
      >
        <SimpleItem
          dataField="reportId"
          editorType="dxTextBox"
          editorOptions= {{
            disabled: true
          }}
        >
          <Label>{localizedString.reportId}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="reportNm"
          editorType="dxTextBox"
          editorOptions= {{
            disabled: flag ? true : false
          }}
        >
          <RequiredRule message={localizedString.validationReportNm}/>
          <Label>{localizedString.reportName}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="reportSubTitle"
          editorType="dxTextBox"
          editorOptions= {{
            disabled: flag ? true : false
          }}
        >
          <Label>{localizedString.reportSubName}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="reportType"
          editorType="dxTextBox"
          editorOptions= {{
            disabled: true
          }}
        >
          <Label>{localizedString.reportType}</Label>
        </SimpleItem>
        {!flag && <SimpleItem
          dataField="fldParentNm"
          editorType="dxTextBox"
          readOnly={true}
          editorOptions={{
            readOnly: true,
            buttons: [folderSearchBtn],
            elementAttr: {
              id: 'fldParentName'
            }
          }}
        >
          <RequiredRule message={localizedString.validationFolderSelect}/>
          <Label>{localizedString.folderManagement}</Label>
        </SimpleItem>}
        {!flag && <SimpleItem
          dataField="regDt"
          editorType="dxTextBox"
          editorOptions= {{
            disabled: true
          }}
        >
          <Label>{localizedString.registerDate}</Label>
        </SimpleItem>}
        <SimpleItem
          dataField="reportTag"
          editorType="dxTextBox"
          editorOptions= {{
            disabled: true
          }}
        >
          <Label>{localizedString.annotation}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="reportOrdinal"
          editorType="dxTextBox"
          editorOptions= {{
            disabled: flag ? true : false
          }}
        >
          <Label>{localizedString.order}</Label>
        </SimpleItem>
        <SimpleItem
          dataField="reportDesc"
          editorType="dxTextArea"
          editorOptions= {{
            disabled: flag ? true : false,
            height: 100
          }}
        >
          <Label>{localizedString.description}</Label>
        </SimpleItem>
        {!flag && <SimpleItem
          dataField="promptYn"
          editorType="dxCheckBox"
        >
          <Label>{localizedString.checkingInitReportRetrieval}</Label>
        </SimpleItem>}
        {!flag &&
        (row.reportType === DesignerMode['AD_HOC']) &&
        row.cube &&
        <SimpleItem
          dataField="maxReportPeriodYn"
          editorType="dxCheckBox"
        >
          <Label>{localizedString.maxReportPeriodYn}</Label>
        </SimpleItem>}
      </Form>
    </Panel>
  );
};

export default ReportInformation;
