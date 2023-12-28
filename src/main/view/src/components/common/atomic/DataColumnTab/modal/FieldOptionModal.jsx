import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import Modal from '../../Modal/organisms/Modal';
import FieldOptionForm from '../molecules/FieldOptionForm';
import {useRef} from 'react';
import {useDispatch} from 'react-redux';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import ItemSlice from 'redux/modules/ItemSlice';
import {useSelector} from 'react-redux';
import {makeFieldOption} from 'components/report/item/util/metaUtilityFactory';

const theme = getTheme();
const FieldOptionModal = ({...props}) => {
  // hook
  const dispatch = useDispatch();

  // actions
  const {updateItemField} = ItemSlice.actions;

  // selector
  const selectedReportId = useSelector(selectCurrentReportId);

  // local
  const formRef = useRef(null);

  const dataFieldOption = _.cloneDeep(props);
  delete dataFieldOption.onClose;

  const onSubmit = () => {
    const formInstance = formRef.current.instance;
    const type = formInstance.getEditor('type').option('value');
    const visible = formInstance.getEditor('visible').option('value');
    let detailSetting = 'value';
    if (type === 'MEA') {
      detailSetting = formInstance.getEditor('detailSetting').option('value');
    }
    const data = makeFieldOption(type, dataFieldOption);

    dispatch(updateItemField({
      reportId: selectedReportId,
      dataField: {
        ...data,
        type: type,
        visible: visible,
        detailSetting: detailSetting
      }}));
  };

  return (
    <Modal
      modalTitle={localizedString.fieldOptionSetting}
      height={theme.size.smallModalHeight}
      width={theme.size.smallModalWidth}
      onSubmit={onSubmit}
      {...props}
    >
      <FieldOptionForm
        formRef={formRef}
        dataFieldOption={dataFieldOption}
      />
    </Modal>
  );
};

export default FieldOptionModal;
