import {getTheme} from 'config/theme';
import localizedString from 'config/localization';
import Modal from 'components/common/atomic/Modal/organisms/Modal';
import ComponentLabel
  from 'components/common/atomic/Common/Label/ComponentLabel';
import {TextBox, NumberBox, TextArea} from 'devextreme-react';
import SearchFileTextBox
  from 'components/common/atomic/Common/Interactive/SearchFileTextBox';
import {useSelector} from 'react-redux';
import {selectCurrentReport} from 'redux/selector/ReportSelector';

const theme = getTheme();

const SaveReportModal = ({...props}) => {
  const report = useSelector(selectCurrentReport);

  return (
    <Modal
      modalTitle={localizedString.saveReport}
      height={theme.size.bigModalHeight}
      width={theme.size.middleModalHeight}
      onSubmit={() => console.log('onSubmit')}
      {...props}
    >
      <ComponentLabel
        component={TextBox}
        labelTitle={localizedString.reportName}
        props={{
          height: theme.size.labelTextBoxHeight,
          value: report.options.reportNm
        }}
      />
      <ComponentLabel
        component={TextBox}
        labelTitle={localizedString.reportSubTitle}
        props={{
          height: theme.size.labelTextBoxHeight,
          // value: report.options.reportSubNm
          value: '부제목'
        }}
      />
      <ComponentLabel
        component={SearchFileTextBox}
        labelTitle={localizedString.selectFolder}
        props={{
          height: theme.size.labelTextBoxHeight,
          // value: report.options.reportFolder
          value: '폴더 선택'
        }}
      />
      <ComponentLabel
        component={NumberBox}
        labelTitle={localizedString.displayOrder}
        props={{
          height: theme.size.labelTextBoxHeight,
          value: report.options.order
        }}
      />
      <ComponentLabel
        component={TextBox}
        labelTitle={localizedString.annotation}
        props={{
          height: theme.size.labelTextBoxHeight,
          value: '주석'
        }}
      />
      <ComponentLabel
        component={TextArea}
        labelTitle={localizedString.description}
        props={{
          height: theme.size.labelTextAreaHeight,
          value: report.options.reportDesc
        }}
      />
    </Modal>
  );
};

export default SaveReportModal;
