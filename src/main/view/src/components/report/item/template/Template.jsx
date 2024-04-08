import ItemManager from '../util/ItemManager';


const Template = ({item}) => {
  const mart = item ? item.mart : null;
  const meta = item ? item.meta : null;

  if (!mart.init) {
    return <></>;
  }

  // D3와 같이 현재 컴포넌트의 너비/높이가 필요한 경우 활성화
  // const {height, width} = useSizeObserver(ref);

  const {itemTools, filterTools} = useItemSetting(item);
  const {getDataField, getPalette} = itemTools;
  const {setMasterFilterData} = filterTools;

  const palette = getPalette();
  const dataField = getDataField();

  return (
    <item
      onClick={({value}) => {
        setMasterFilterData(value);
        console.log(palette);
        console.log(dataField);
        console.log(meta);
      }}
    />
  );
};

export default React.memo(Template, ItemManager.commonPropsComparator);
