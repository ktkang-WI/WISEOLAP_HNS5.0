import D3RadialTree from './D3RadialTree';

const RadialTree = ({
  setItemExports,
  id,
  item
}) => {
  const mart = item?.mart;
  if (!mart.init) {
    return <></>;
  }
  return (
    <D3RadialTree
      dataSource={JSON.parse(mart.data.info.jsonData)}
    />
  );
};

export default RadialTree;
