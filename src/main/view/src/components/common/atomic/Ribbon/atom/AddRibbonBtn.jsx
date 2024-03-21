import {getTheme} from 'config/theme';
import RibbonButton from '../../Common/Button/RibbonButton';
import RibbonPanel from '../../Common/Panel/RibbonPanel';

const theme = getTheme();
const AddRibbonBtn = ({item}) => {
  return (
    <RibbonPanel id={item.id} key={item.id} position={item.position}>
      <RibbonButton
        buttonKeyId={item.id}
        label={item.label}
        imgSrc={item.imgSrc}
        title={item.label}
        width={item.width}
        height={'calc(' + theme.size.ribbonheight + ' - 10px)'}
        useArrowButton={item.useArrowButton}
        onClick={item.onClick}
      />
    </RibbonPanel>
  );
};
export default AddRibbonBtn;
