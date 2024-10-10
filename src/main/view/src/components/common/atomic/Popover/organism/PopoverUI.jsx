import styled from 'styled-components';
import RibbonPopoverContents from '../molecules/RibbonPopoverContents';
import elementFactory from '../molecules/ElementFactory';

const PopoverWrap = styled.div`
  background-color: #fff;
  border: none;
  box-shadow: 0 0 4px 0px rgba(0,0,0,.25);
  width: ${(props)=> props.width? props.width: '200px'}
  height: ${(props)=> props.height? props.height: '300px'};
  white-space: nowrap;
`;

const PopoverUI = ({id, width, height, popoverType, titlePanel, props}) => {
  const element = elementFactory();
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
        element={element[id]}
        id={id}
        titlePanel={titlePanel}
        popoverType={popoverType}
        {...props}/>
    </PopoverWrap>
  );
};
export default PopoverUI;
