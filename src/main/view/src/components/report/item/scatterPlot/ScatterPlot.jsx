
const ScatterPlot = ({setItemExports, id, item}) => {
  const mart = item ? item.mart : null;
  if (!mart.init) {
    return <></>;
  }
  return (
    <div>
      Hello World!
    </div>
  );
};

export default ScatterPlot;
