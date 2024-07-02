import {createContext, useRef, useState} from 'react';
import {Mode, tabItems} from './data/UserGroupManagementData.js';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper.jsx';
import {useLoaderData} from 'react-router-dom';
import {Group, User} from
  'models/config/userGroupManagement/UserGroupManagement.js';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal.js';
import UserPasswordModal from
  'components/config/atoms/userGroupManagement/UserPasswordModal.jsx';
import {getHint} from 'components/config/utility/utility.js';
import AddRibbonBtn
  from 'components/common/atomic/Ribbon/atom/AddRibbonBtn.jsx';
import ConfigHeader from 'components/config/atoms/common/ConfigHeader.jsx';
import ConfigTabs from '../common/ConfigTabs.jsx';
import {iconMapper} from '../common/ConfigUtility.js';

export const UserGroupContext = createContext();

const UserGroupManagement = () => {
  const {alert, openModal} = useModal();

  const {userGroupManagement} = useLoaderData();
  const [groupsFormat, setGroupsFormat] =
  useState(userGroupManagement.groupsFormat);
  const [groupDetailInfo, setGroupDetailInfo] = useState();
  const [usersFormat, setUsersFormat] =
  useState(userGroupManagement.usersFormat);
  const [userDetailInfo, setUserDetailInfo] = useState(new User({}));
  const [groupMemberUsers, setGroupMemberUsers] = useState();
  const [groupNotMemberUsers, setGroupNotMemberUsers] = useState(usersFormat);
  const [mode, setMode] = useState(tabItems[0].value);

  // ref
  const userInfoRef = useRef();
  const userDataGridRef = useRef();
  const userIdRef = useRef();
  const groupDataGridRef = useRef();
  const groupInfoRef = useRef();
  const groupMemberUserRef = useRef();
  const groupNotMemberUserRef = useRef();

  const btns = ['plus', 'save', 'remove', 'key'];

  const context = {
    state: {
      groupsFormat: [groupsFormat, setGroupsFormat],
      groupDetailInfo: [groupDetailInfo, setGroupDetailInfo],
      usersFormat: [usersFormat, setUsersFormat],
      userDetailInfo: [userDetailInfo, setUserDetailInfo],
      groupMemberUsers: [groupMemberUsers, setGroupMemberUsers],
      groupNotMemberUsers: [groupNotMemberUsers, setGroupNotMemberUsers]
    },
    ref: {
      userDataGridRef: userDataGridRef,
      userInfoRef: userInfoRef,
      userIdRef: userIdRef,
      groupDataGridRef: groupDataGridRef,
      groupInfoRef: groupInfoRef,
      groupMemberUserRef: groupMemberUserRef,
      groupNotMemberUserRef: groupNotMemberUserRef
    }
  };

  const handleBtnClick = (icon) => {
    let instance = {};

    if (mode === Mode.USER) {
      const userInfoFormData = userInfoRef.current?._instance
          .option('formData');
      instance = new User(userInfoFormData);
    }
    if (mode === Mode.GROUP) {
      const groupInfoFormData = groupInfoRef.current?._instance
          .option('formData');
      instance = new Group(groupInfoFormData);
    }

    switch (icon) {
      case 'plus':
        handlePlus();
        break;
      case 'save':
        handleSave({instance});
        break;
      case 'remove':
        handleRemove({instance});
        break;
      case 'key':
        handleKey({instance});
      default:
        break;
    }
  };

  // 유효성 검사와 결과 처리를 위한 공통 함수
  const validateAndProcess = (validate, process) => {
    validate.complete?.then((res) => {
      if (res.isValid) {
        process();
      } else {
        alert(localizedString.validationAlert);
      }
    }).catch((error) => {
      throw new Error('Failed Validation');
    });
  };

  const init = (instance, msg) => {
    instance.getUserGroups()
        .then((userGroups) => {
          setUserDetailInfo(new User({}));
          setUsersFormat(userGroups.usersFormat);
          setGroupsFormat(userGroups.groupsFormat);

          setGroupDetailInfo(new Group({}));
          setGroupNotMemberUsers(userGroups.usersFormat);
          setGroupMemberUsers([]);
          alert(`${msg}`);
        })
        .catch(() => {
          throw new Error('Failed UserGroupManagement Init');
        });
  };

  const handleSaveUser = (user) => {
    const saveUser = () => {
      const action = user.userNo === 0 ? user.createUser : user.updateUser;
      const successMessage = user.userNo === 0 ?
      localizedString.successSave : localizedString.successUpdate;

      action().then((response) => {
        if (response.data.data) {
          init(user, successMessage);
        }
      }).catch(() => {
        throw new Error(user.userNo === 0 ?
          'Failure Create User' : 'Failure Update User');
      });
    };

    validateAndProcess(userInfoRef.current._instance.validate(), saveUser);
  };

  const handleRemoveInstance = (instance, action) => {
    const successMessage = localizedString.successRemove;

    action().then((response) => {
      if (response.data.data) {
        init(instance, successMessage);
      }
    }).catch(() => {
      throw new Error('Failed Delete User');
    });
  };

  const handleSaveGroup = (group) => {
    const saveGroup = () => {
      if (groupMemberUsers.length === 0) {
        alert(localizedString.validationGroupMemberUsers);
        return;
      }

      const action = group.grpId === 0 ? group.createGroup : group.updateGroup;
      const successMessage = group.grpId === 0 ?
      localizedString.successSave : localizedString.successUpdate;

      group.setGrpMemberUsers(groupMemberUsers);

      action().then((response) => {
        if (response.data.data) {
          init(group, successMessage);
        }
      }).catch(() => {
        throw new Error(group.grpId === 0 ?
          'Failed Create Group' : 'Failed Update Group');
      });
    };

    validateAndProcess(groupInfoRef.current._instance.validate(), saveGroup);
  };

  const handlePlus = () => {
    const clearAndSetNewDetail = (dataGridRef, setDetailInfo, NewInstance,
        additionalAction = () => {}) => {
      dataGridRef.current._instance.clearSelection();
      setDetailInfo(new NewInstance({}));
      additionalAction();
    };

    if (mode === Mode.USER) {
      clearAndSetNewDetail(userDataGridRef, setUserDetailInfo, User);
    } else if (mode === Mode.GROUP) {
      const fetchAndSetGroupNotMemberUsers = () => {
        new Group({}).getGroupNotMemberUsers()
            .then((users) => {
              setGroupNotMemberUsers(users);
            })
            .catch(() => {
              throw new Error('Failed to get Users');
            });
        setGroupMemberUsers([]);
      };

      clearAndSetNewDetail(groupDataGridRef, setGroupDetailInfo, Group,
          fetchAndSetGroupNotMemberUsers);
    }
  };

  const handleSave = ({instance}) => {
    if (mode === Mode.USER) {
      handleSaveUser(instance);
    }

    if (mode === Mode.GROUP) {
      handleSaveGroup(instance);
    }
  };

  const handleRemove = ({instance}) => {
    if (mode === Mode.USER) {
      if (instance.userNo !== 0) {
        handleRemoveInstance(instance, instance.deleteUser);
      };
    }

    if (mode === Mode.GROUP) {
      if (instance.grpId !== 0) {
        handleRemoveInstance(instance, instance.deleteGroup);
      };
    }
  };

  const handleKey = ({instance}) => {
    const user = instance;
    if (user.userNo !== 0) {
      openModal(UserPasswordModal, {
        user: user
      });
    }
  };

  const navBarItems = (mode) => {
    if (mode === Mode.USER) {
      return (
        btns.map((item, index) => (
          <AddRibbonBtn
            key={index}
            item={{
              'imgSrc': iconMapper[item],
              'width': item == 'key' ? '70px' : undefined,
              'onClick': () => handleBtnClick(item),
              'label': getHint(item)
            }}
          />
        ))
      );
    } else if (mode === Mode.GROUP) {
      return (
        btns.filter((item) => item !== 'key')
            .map((item, index) => (
              <AddRibbonBtn
                key={index}
                item={{
                  'imgSrc': iconMapper[item],
                  'onClick': () => handleBtnClick(item),
                  'label': getHint(item)
                }}
              />
            ))
      );
    };
  };

  return (
    <UserGroupContext.Provider
      value={context}>
      <Wrapper display='flex' direction='column'>
        <ConfigHeader>
          {navBarItems(mode)}
        </ConfigHeader>
        <ConfigTabs
          tabItems={tabItems}
          onChangedValue={setMode}
          page={mode}
        >
        </ConfigTabs>
      </Wrapper>
    </UserGroupContext.Provider>
  );
};

export default UserGroupManagement;
