
const CollapsibleTree = ({
  setItemExports,
  id,
  item
}) => {
  const mart = item?.mart;
  if (!mart.init) {
    return <></>;
  }
  return (
    <div>CollapsibleTree</div>
  );
};

export default CollapsibleTree;
