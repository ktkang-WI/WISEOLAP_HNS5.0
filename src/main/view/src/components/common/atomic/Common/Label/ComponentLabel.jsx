import styled from 'styled-components';
import {getTheme} from 'config/theme';
import LabelWrapper from '../Wrap/LabelWrapper';

const theme = getTheme();

const Label = styled.div`
  font: ${theme.font.labelTitle};
  color: ${theme.color.primary};
  padding-bottom: 5px;
  margin-bottom: 5px;
  border-bottom: solid 1px ${theme.color.breakLine};
`;

const ComponentLabel = ({component, labelTitle, props}) => {
  const Component = component;
  return (
    <LabelWrapper>
      <Label>{labelTitle}</Label>
      <Component
        {...props}
      />
    </LabelWrapper>
  );
};
export default ComponentLabel;
