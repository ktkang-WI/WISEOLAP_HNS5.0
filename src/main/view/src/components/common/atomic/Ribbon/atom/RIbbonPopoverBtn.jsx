import {getTheme} from 'config/theme';
import RibbonButton from '../../Common/Button/RibbonButton';
import RibbonPanel from '../../Common/Panel/RibbonPanel';
import {Popover} from 'devextreme-react';

const theme = getTheme();

const RibbonPopoverBtn = ({item}) => {
  return (
    <RibbonPanel id={item.id} key={item.id} position={item.position}>
      <RibbonButton
        buttonKeyId={item.id}
        label={item.label}
        imgSrc={item.imgSrc}
        title={item.label}
        width={item.width}
        height={'calc(' + theme.size.ribbonHeight + ' - 10px)'}
        useArrowButton={item.useArrowButton}
      />
      <Popover
        target={'#' + item.id}
        showEvent={'click'}
        minWidth="200px"
        height={item.popoverHeight}
        width={item.id === 'seriesType' ? '600px': item.popoverWidth}
        hideOnOutsideClick
        contentRender={item.renderContent}
      ></Popover>
    </RibbonPanel>
  );
};

export default RibbonPopoverBtn;
