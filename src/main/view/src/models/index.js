import * as DataSource from './dataset/DataSource';
import * as Cube from './dataset/Cube';
import * as DSView from './dataset/DSView';
import * as DBInfo from './dataset/DBInfo';
import * as SingleTable from './dataset/SingleTable';
import * as Item from './report/Item';
import * as Report from './report/Report';
import * as Parameter from './dataset/Parameter';
import * as Preferences from './config/preferences/Preferences';
import * as UserGroupManagement
  from './config/userGroupManagement/UserGroupManagement';
import * as Authority from './config/authority/Authority';
import * as File from './upload/File';
import * as Login from './auth/Login';
import * as Log from './config/log/Log';
import * as ReportFolderManagement
  from './config/reportFolderManagement/ReportFolderManagement';
import * as MyPageConfig from './config/myPage/MyPageConfig';
import * as Download from './report/Download';
import * as Portal from './portal';
import * as ProgManagement
  from './config/progManagement/ProgManagement';
export default {
  DataSource,
  Cube,
  DSView,
  SingleTable,
  DBInfo,
  Item,
  Parameter,
  Report,
  File,
  Login,
  Preferences,
  UserGroupManagement,
  Authority,
  Log,
  ReportFolderManagement,
  MyPageConfig,
  Download,
  Portal,
  ProgManagement
};
