import RibbonPanel from '../../Common/Panel/RibbonPanel';
import CommonButton from '../../Common/Button/TextButton';
const RibbonCommonBtn = ({item}) => {
  return (
    <RibbonPanel key={item.id} position={item.position}>
      <CommonButton
        label={item.label}
        title={item.title}
        width={item.width}
        height={item.height}
        onClick={item.onClick}
      >
        {item.label}
      </CommonButton>
    </RibbonPanel>
  );
};
export default RibbonCommonBtn;
