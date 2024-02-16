import {styled} from 'styled-components';
import ReportTitlePanel from '../../Common/Panel/ReportTitlePanel';
import ReportTitleText from '../atom/ReportTitleText';
import closeImg from 'assets/image/icon/button/close.png';


const DeleteButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 100%;
  line-height: 100px;
  font-weight: bold;
  color: gray;
  cursor: pointer;
  margin-left: 20px;
`;

const ReportTitleTab = ({
  children, height, onClick, onDelete, selected
}) => {
  return (
    <ReportTitlePanel selected={selected} height={height}>
      <ReportTitleText onClick={onClick}>
        {children}
      </ReportTitleText>
      {
        onDelete &&
        <DeleteButton onClick={onDelete}>
          <img src={closeImg}/>
        </DeleteButton>
      }
    </ReportTitlePanel>
  );
};

export default ReportTitleTab;
