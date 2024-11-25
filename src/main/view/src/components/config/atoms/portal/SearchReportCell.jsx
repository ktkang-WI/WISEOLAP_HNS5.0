import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import SelectReportModal
  from 'components/config/organisms/portal/modal/SelectReportModal';
import useModal from 'hooks/useModal';
import {useState} from 'react';

const SearchReportCell = ({reportList, onSubmit, defaultValue=''}) => {
  const {openModal} = useModal();
  const [text, setText] = useState(defaultValue);

  const _onSubmit = (itemData) => {
    onSubmit(itemData);
    setText(itemData.reportNm);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0px 10px'
    }}>
      <span style={{
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>{text}</span>
      <CommonButton
        height='30px'
        width='50px'
        type='whiteRound'
        onClick={() => {
          openModal(SelectReportModal, {reportList, onSubmit: _onSubmit});
        }}>
        검색
      </CommonButton>
    </div>
  );
};

export default SearchReportCell;
