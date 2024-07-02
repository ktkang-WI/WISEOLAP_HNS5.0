import LoginLog from 'components/config/molecules/log/contents/LoginLog';
import ReportLog from 'components/config/molecules/log/contents/ReportLog';
import DownloadLog from 'components/config/molecules/log/contents/DownloadLog';
import QueryLog from 'components/config/molecules/log/contents/QueryLog';
import localizedString from 'config/localization';
import models from 'models';

const tabItems = [
  {
    'text': localizedString.log.loginLog,
    'value': 'login_log',
    'component': LoginLog
  },
  {
    'text': localizedString.log.reportLog,
    'value': 'report_log',
    'component': ReportLog
  },
  {
    'text': localizedString.log.exportLog,
    'value': 'export_log',
    'component': DownloadLog
  },
  {
    'text': localizedString.log.queryLog,
    'value': 'query_log',
    'component': QueryLog
  }
];

const searchingMapper = {
  'login_log': models.Log.getLoginLog,
  'report_log': models.Log.getReportLog,
  'export_log': models.Log.getDownloadLog,
  'query_log': models.Log.getQueryLog
};

export {tabItems, searchingMapper};
