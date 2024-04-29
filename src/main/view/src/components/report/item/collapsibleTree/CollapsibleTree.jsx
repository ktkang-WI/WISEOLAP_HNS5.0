import D3CollapsibleTree from './D3CollapsibleTree';

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
    <D3CollapsibleTree
      dataSource={JSON.parse(mart.data.info.jsonData)}
    />
  );
};

export default CollapsibleTree;
