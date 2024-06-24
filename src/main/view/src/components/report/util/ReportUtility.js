import excel from 'assets/image/icon/report/excel_file.png';
import adhoc from 'assets/image/icon/report/adhoc.png';
import folder
  from 'assets/image/icon/report/folder_load.png';
import dash from 'assets/image/icon/report/dash.png';
import ItemType from '../item/util/ItemType';

export const setIconReportList = (list) => {
  list.map((report) => {
    if (report.type == 'FOLDER') {
      report.icon = folder;
      return;
    }

    if (report.reportType == 'DashAny') {
      report.icon = dash;
    } else if (report.reportType == 'AdHoc') {
      report.icon = adhoc;
    } else if (report.reportType == 'Spread' ||
        report.reportType == 'Excel') {
      report.icon = excel;
    }
  });
};

export const addReportType = (list, str) => {
  return list.map((row) => {
    return {
      ...row,
      type: str
    };
  });
};

export const nullDataCheck = (item) => {
  const excludedItems = [
    ItemType.TEXT_BOX,
    ItemType.SCHEDULER_COMPONENT,
    ItemType.PIVOT_GRID
  ];

  const isExclude = excludedItems.includes(item.type);
  if (isExclude) return false;

  return !item ||
  item?.mart?.data?.data?.length === 0 ||
  _.isEmpty(item?.mart?.data || {});
};
