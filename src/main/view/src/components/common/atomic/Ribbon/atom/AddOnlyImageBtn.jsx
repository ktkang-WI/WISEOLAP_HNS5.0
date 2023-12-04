import OnlyImageButton from '../../Common/Button/OnlyImageButton';
import RibbonPanel from '../../Common/Panel/RibbonPanel';

const AddOnlyImageBtn = () => {
  return (
    <RibbonPanel key={item.id} position={item.position}>
      <OnlyImageButton
        label={item.label}
        imgSrc={item.imgSrc}
        title={item.title}
        width={item.width}
        height={item.height}
        onClick={item.onClick}
      />
    </RibbonPanel>
  );
};
export default AddOnlyImageBtn;
