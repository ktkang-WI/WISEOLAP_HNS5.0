import GroupManagement
  from 'components/config/molecules/userGroupManagement/GroupManagement';
import UserManagement
  from 'components/config/molecules/userGroupManagement/UserManagement';
import localizedString from 'config/localization';

export const Mode = {
  USER: 'USER',
  GROUP: 'GROUP'
};

export const dataSource = [
  {
    mode: Mode.USER,
    title: localizedString.userManagement,
    component: <UserManagement/>
  },
  {
    mode: Mode.GROUP,
    title: localizedString.groupManagement,
    component: <GroupManagement/>
  }
];
