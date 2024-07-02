import GroupManagement
  from 'components/config/molecules/userGroupManagement/GroupManagement';
import UserManagement
  from 'components/config/molecules/userGroupManagement/UserManagement';
import localizedString from 'config/localization';

export const Mode = {
  USER: 'USER',
  GROUP: 'GROUP'
};

export const tabItems = [
  {
    value: Mode.USER,
    text: localizedString.userManagement,
    component: UserManagement
  },
  {
    value: Mode.GROUP,
    text: localizedString.groupManagement,
    component: GroupManagement
  }
];
