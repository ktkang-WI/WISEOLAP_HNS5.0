import styled from 'styled-components';
import RibbonPopoverContents from '../molecules/RibbonPopoverContents';

const PopoverWrap = styled.div`
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 5px 0 rgba(51, 51, 51, 0.3);
  width: ${(props)=> props.width? props.width: '300px'};
  height: ${(props)=> props.height? props.height: '300px'};
`;

const PopoverUI = ({id, width, height, popoverType, titlePanel, props}) => {
  return (
    <PopoverWrap
      id={id}
      width={width}
      height={height}
      titlePanel={titlePanel}
      popoverType={popoverType}
      {...props}
    >
      <RibbonPopoverContents
        id={id}
        titlePanel={titlePanel}
        popoverType={popoverType}
        {...props}/>
    </PopoverWrap>
  );
};
export default PopoverUI;
