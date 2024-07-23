import {itemExportsObject}
  from 'components/report/atomic/ItemBoard/organisms/ItemBoard';
import {useEffect} from 'react';

const useItemExport = ({
  id,
  ref,
  type,
  data,
  setItemExports
}) => {
  const exportData = data?.map((obj ) => {
    const newObj = {...obj};
    delete newObj.arg;
    return newObj;
  });
  const itemExportObject = itemExportsObject(id, ref, type, exportData);
  useEffect(() => {
    setItemExports((prev) => {
      const itemExports =
        prev.filter((item) => item.id !== itemExportObject.id);
      return [
        ...itemExports,
        itemExportObject
      ];
    });
  }, [data]);
};

export default useItemExport;
