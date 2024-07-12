import {getTheme} from 'config/theme';
import {styled} from 'styled-components';

const theme = getTheme();

// eslint-disable-next-line max-len
const FilterBarBtn = ({width, children, isExpand, justifyContent, ...props}) => {
  const BtnWrapper = styled.div`
    width: ${width || '40px'};
    min-width: ${width || '40px'};
    display: flex;
    height: ${isExpand ? 'auto' : theme.size.filterBarHeight};
    flex-direction: row;
    box-sizing: border-box;
    align-items: center;
    justify-content: ${justifyContent ? justifyContent : 'flex-start'};
    cursor: pointer;
    margin-right: 5px;
    font: ${theme.font.small};

    * + * {
      margin-left: 3px;
    }
  `;

  return (
    <BtnWrapper {...props}>
      {children}
    </BtnWrapper>
  );
};

export default FilterBarBtn;
