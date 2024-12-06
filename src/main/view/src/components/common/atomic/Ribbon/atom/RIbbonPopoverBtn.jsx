import {getTheme} from 'config/theme';
import RibbonButton from '../../Common/Button/RibbonButton';
import RibbonPanel from '../../Common/Panel/RibbonPanel';
import {Popover} from 'devextreme-react';
import {useState} from 'react';

const theme = getTheme();

const RibbonPopoverBtn = ({item}) => {
  const [key, setKey] = useState(0);

  const forceUpdate = () => setKey((prev) => prev + 1);
  return (
    <RibbonPanel id={item.id} key={item.id} position={item.position}>
      <RibbonButton
        buttonKeyId={item.id}
        label={item.label}
        imgSrc={item.imgSrc}
        title={item.label}
        width={item.width}
        onClick={forceUpdate}
        height={'calc(' + theme.size.ribbonHeight + ' - 10px)'}
        useArrowButton={item.useArrowButton}
      />
      <Popover
        key={key}
        target={'#' + item.id}
        showEvent={'click'}
        minWidth="200px"
        height={item.popoverHeight}
        width={item.popoverWidth}
        hideOnOutsideClick
        contentRender={(e) => {
          return item.renderContent(e);
        }}
      ></Popover>
    </RibbonPanel>
  );
};

export default RibbonPopoverBtn;
