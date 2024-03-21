import RibbonPanel from '../../Common/Panel/RibbonPanel';
import CommonButton from '../../Common/Button/CommonButton';
import {getTheme} from 'config/theme';

const theme = getTheme();

const AddCommonBtn = ({item}) => {
  return (
    <RibbonPanel key={item.id} position={item.position}>
      <CommonButton
        type='secondary'
        label={item.label}
        title={item.label}
        width={item.width}
        height={item.height}
        font={theme.font.ribbonButton}
        onClick={item.onClick}
        borderradius='4px'
      >
        {item.icon && <img src={item.icon}/>}
        {item.label}
      </CommonButton>
    </RibbonPanel>
  );
};
export default AddCommonBtn;
