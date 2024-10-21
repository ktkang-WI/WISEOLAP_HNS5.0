import Modal from 'components/common/atomic/Modal/organisms/Modal';
import {getTheme} from 'config/theme';
import {useRef} from 'react';
import ItemSlice from 'redux/modules/ItemSlice';
import _ from 'lodash';
import {useDispatch} from 'react-redux';
import TooltipForm from './molecules/TooltipForm';
import {useSelector} from 'react-redux';
import {selectCurrentItem} from 'redux/selector/ItemSelector';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import LabelEditForm from './molecules/LabelEditForm';
// import YAxisExtraAxisForm from '../../chart/molecules/YAxisExtraAxisForm';
import XAxisForm from '../../chart/molecules/XAxisForm';
import FormatOptionForm
  from 'components/report/atomic/Format/molecules/FormatOptionForm';

const theme = getTheme();

const ItemOptionModal = ({popupName, height, ...props}) => {
  const selectedItem = useSelector(selectCurrentItem);
  const reportId = useSelector(selectCurrentReportId);
  const dispatch = useDispatch();
  const ref = useRef();
  const {updateItem} = ItemSlice.actions;

  const setMeta = (item, key, value) => {
    return {
      ...item,
      meta: {
        ...item.meta,
        [key]: value
      }
    };
  };

  return (
    <Modal
      onSubmit={() => {
        const formData = _.cloneDeep(ref.current.props.formData);
        const selectedItemClone = _.cloneDeep(selectedItem);
        const item = setMeta(selectedItemClone, popupName, formData);

        dispatch(updateItem({reportId: reportId, item: item}));

        return false;
      }}
      modalTitle={props.modalTitle}
      width={theme.size.smallModalWidth}
      height={height ? height : theme.size.bigModalHeight}
      {...props}
    >
      {popupName === 'tooltip' &&
        <TooltipForm
          selectedItem={selectedItem}
          ref={ref}
        />
      }
      {popupName === 'labelEdit' &&
        <LabelEditForm
          selectedItem={selectedItem}
          ref={ref}
        />
      }
      {(popupName === 'extraAxis' || popupName === 'yAxis') &&
        <FormatOptionForm
          itemType={selectedItem?.type || ''}
          formData={_.cloneDeep(selectedItem.meta[popupName])}
          formRef={ref}
          axisSetting={true}
        />
      }
      {(popupName === 'xAxis') &&
        <XAxisForm
          selectedItem={selectedItem}
          ref={ref}
        />
      }
    </Modal>
  );
};
export default ItemOptionModal;
