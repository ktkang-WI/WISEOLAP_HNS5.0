import GroupManagement
  from 'components/config/molecules/userGroupManagement/GroupManagement';
import UserManagement
  from 'components/config/molecules/userGroupManagement/UserManagement';

export const Mode = {
  USER: 'USER',
  GROUP: 'GROUP'
};

export const dataSource = [
  {
    mode: Mode.USER,
    title: '사용자 관리',
    component: <UserManagement/>
  },
  {
    mode: Mode.GROUP,
    title: '그룹 관리',
    component: <GroupManagement/>
  }
];
