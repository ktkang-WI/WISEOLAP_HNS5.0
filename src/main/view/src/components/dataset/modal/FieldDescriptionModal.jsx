import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {getTheme} from 'config/theme';
import localizedString from 'config/localization';
import {DataGrid} from 'devextreme-react';
import {Column, Editing} from 'devextreme-react/data-grid';
import {useSelector} from 'react-redux';
import {selectCurrentDataset} from 'redux/selector/DatasetSelector';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import DatasetSlice from 'redux/modules/DatasetSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';

const theme = getTheme();

const FieldDescriptionModal = ({...props}) => {
  const dataset = useSelector(selectCurrentDataset);
  const reportId = useSelector(selectCurrentReportId);
  const fields = _.cloneDeep((dataset.fields || []).slice(1));
  const [fieldDesc, setFieldDesc] = useState(dataset.fieldDescription || {});
  const dispatch = useDispatch();
  const {updateDataset} = DatasetSlice.actions;

  const onRowUpdating = (e) => {
    const updatedFieldDesc = {
      ...fieldDesc,
      [e.oldData.name]: e.newData.description
    };
    setFieldDesc(updatedFieldDesc);
  };
  return (
    <Modal
      width={theme.size.smallModalWidth}
      height={theme.size.middleModalHeight}
      modalTitle={localizedString.addFieldDescription}
      onSubmit={() => {
        dispatch(updateDataset({
          reportId,
          dataset: {
            ...dataset,
            fieldDescription: fieldDesc
          }
        }));
      }}
      {...props}
    >
      <DataGrid
        height={'100%'}
        showBorders={true}
        dataSource={fields}
        onRowUpdating={onRowUpdating}
      >
        <Editing
          mode="cell"
          allowUpdating={true}
        />
        <Column
          dataField='name'
          caption={localizedString.field}
          width={'150px'}
          allowEditing={false}
        />
        <Column
          dataField='description'
          cellRender={(e) => {
            return fieldDesc[e.data.name];
          }}
          caption={localizedString.description}
          allowEditing={true}
        />
      </DataGrid>
    </Modal>
  );
};

export default FieldDescriptionModal;
