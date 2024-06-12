import excel from 'assets/image/icon/report/excel_file.png';
import adhoc from 'assets/image/icon/report/adhoc.png';
import folder
  from 'assets/image/icon/report/folder_load.png';
import dash from 'assets/image/icon/report/dash.png';

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
