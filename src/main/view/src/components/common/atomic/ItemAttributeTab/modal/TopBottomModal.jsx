// import LocalizedStrings from 'react-localization';
import useQueryExecute from 'hooks/useQueryExecute';
import {useState} from 'react';
import Modal from '../../Modal/organisms/Modal';
import TopBottomForm from '../molecules/TopBottomForm';
import {getTheme} from 'config/theme';
import ItemSlice from 'redux/modules/ItemSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';

const theme = getTheme();

const TopBottomModal = ({topBottomInfo, ...props}) => {
  // hook
  const {executeItems} = useQueryExecute();
  const dispatch = useDispatch();

  // actions
  const {updateTopBottomInfo} = ItemSlice.actions;

  // selector
  const selectedReportId = useSelector(selectCurrentReportId);

  // state
  const [formData, setFormData] = useState(_.cloneDeep(topBottomInfo));

  const onSubmit = () => {
    dispatch(updateTopBottomInfo({
      reportId: selectedReportId,
      topBottomInfo: formData
    }));
    // 조회
    executeItems();
    return false;
  };

  const onDelete = () => {
    dispatch(updateTopBottomInfo({
      reportId: selectedReportId,
      topBottomInfo: {
        dataFieldId: '',
        applyFieldId: '',
        topBottomType: 'TOP',
        topBottomCount: 0,
        isPercent: false,
        isShowOthers: false
      }
    }));
    // 조회
    executeItems();
  };

  return (
    <Modal
      modalTitle={'Top/Bottom 값 설정'}
      height={theme.size.middleModalHeight}
      width={theme.size.middleModalHeight}
      onSubmit={onSubmit}
      onDelete={onDelete}
      {...props}
    >
      <TopBottomForm
        formData={formData}
        onFieldDataChanged={(e) => {
          setFormData({[e.dataField]: e.value});
        }}
      />
    </Modal>
  );
};

export default TopBottomModal;
