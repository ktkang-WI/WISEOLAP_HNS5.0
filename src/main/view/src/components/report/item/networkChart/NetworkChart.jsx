
const NetworkChart = ({setItemExports, id, item}) => {
  const mart = item ? item.mart : null;
  if (!mart.init) {
    return <></>;
  }
  return (
    <div>
      NetworkChart
    </div>
  );
};

export default NetworkChart;
