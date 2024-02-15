import {styled} from 'styled-components';
import ReportTitlePanel from '../../Common/Panel/ReportTitlePanel';
import ReportTitleText from '../atom/ReportTitleText';


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
`;

const ReportTitleTab = ({children, height, onClick, onDelete}) => {
  return (
    <ReportTitlePanel height={height}>
      <ReportTitleText onClick={onClick}>
        {children}
      </ReportTitleText>
      {
        onDelete &&
        <DeleteButton onClick={onDelete}>
          X</DeleteButton>
      }
    </ReportTitlePanel>
  );
};

export default ReportTitleTab;
