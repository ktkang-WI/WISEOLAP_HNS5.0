import CalendarOptionForm from './DetailOptionForms/CalendarOptionForm';
import InputOptionForm from './DetailOptionForms/InputOptionForm';
import ListOptionForm from './DetailOptionForms/ListOptionForm';
import {styled} from 'styled-components';

const OptionWrapper = styled.div`
  padding: 10px;
`;
const DetailOptionForm = ({param, ...props}) => {
  const ParamComponent = {
    'LIST': <ListOptionForm param={param} {...props}/>,
    'INPUT': <InputOptionForm param={param} {...props}/>,
    'CALENDAR': <CalendarOptionForm param={param} {...props}/>
  };

  return (
    <OptionWrapper>
      {ParamComponent[param.paramType]}
    </OptionWrapper>
  );
};

export default DetailOptionForm;
