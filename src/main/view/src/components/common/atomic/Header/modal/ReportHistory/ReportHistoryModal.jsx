import Modal from 'components/common/atomic/Modal/organisms/Modal';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import DataGrid, {Column} from 'devextreme-react/data-grid';

const theme = getTheme();

const ReportHistoryModal = ({...props}) => {
  return (
    <Modal
      modalTitle={localizedString.reportHistory}
      height={theme.size.middleModalHeight}
      width={theme.size.smallModalWidth}
      {...props}
    >
      <DataGrid
        showBorders={true}
        height={'100%'}
      >
        <Column
          caption='순번'
        />
        <Column
          caption='저장 날짜'
        />
        <Column
          caption='복원'
        />
      </DataGrid>

    </Modal>
  );
};

export default ReportHistoryModal;
