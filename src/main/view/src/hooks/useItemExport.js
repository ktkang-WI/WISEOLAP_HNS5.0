import {itemExportsObject}
  from 'components/report/atomic/ItemDownload/ItemDownload';
import {useEffect} from 'react';

const useItemExport = ({
  id,
  ref,
  type,
  data,
  setItemExports
}) => {
  const exportData = (data || []).map(({arg, ...newObj}) => newObj);
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
