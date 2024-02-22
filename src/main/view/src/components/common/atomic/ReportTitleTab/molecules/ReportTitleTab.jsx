import {styled} from 'styled-components';
import ReportTitlePanel from '../../Common/Panel/ReportTitlePanel';
import ReportTitleText from '../atom/ReportTitleText';
import closeImg from 'assets/image/icon/button/close.png';
import closeImg2 from 'assets/image/icon/button/close_disable.png';


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
      <ReportTitleText selected={selected} onClick={onClick}>
        {children}
      </ReportTitleText>
      {
        onDelete &&
        <DeleteButton onClick={onDelete}>
          <img src={selected ? closeImg : closeImg2}/>
        </DeleteButton>
      }
    </ReportTitlePanel>
  );
};

export default ReportTitleTab;
