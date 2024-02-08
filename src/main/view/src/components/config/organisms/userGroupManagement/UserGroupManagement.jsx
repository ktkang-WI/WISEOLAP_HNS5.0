import {createContext, useCallback, useRef, useState} from 'react';
import styled from 'styled-components';
import {Button, TabPanel} from 'devextreme-react';
import {Mode, dataSource} from './data/UserGroupManagementData.js';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper.jsx';
import {useLoaderData} from 'react-router-dom';
import {User} from 'models/config/userGroupManagement/UserGroupManagement.js';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal.js';
import UserPasswordModal from
  'components/config/atoms/userGroupManagement/UserPasswordModal.jsx';

// import useModal from 'hooks/useModal.js';

const NavBar = styled.div`
  width:100%;
  height:100%;
  display:flex;
  flex-direction: ${(props)=> props.direction ? props.direction : 'row'};
`;

const NavBarItem = styled.div`
  width:100%;
  height:100%;
  display:flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 30px;
  padding: 0px 3px;
`;

const Header = styled.div`
  flex: 0 0 50px;
  background-color:#e1e1e1;
`;

const Content = styled.div`
  height:100%;
  display:flex;
  flex-direction: row;
  flex: 0 0 1;
`;

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
  const [groupNotMemberUsers, setGroupNotMemberUsers] = useState();
  const [mode, setMode] = useState(dataSource[0].mode);

  // ref
  const userInfoRef = useRef();
  const userDataGridRef = useRef();

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
      userInfoRef: userInfoRef
    }
  };

  const TabPanelItem = useCallback(({data}) => {
    return data.component;
  }, [groupsFormat, usersFormat]);

  const handleBtnClick = ({component}) => {
    const icon = component.option('icon');
    const formData = userInfoRef.current._instance.option('formData');
    const user = new User(formData);

    switch (icon) {
      case 'plus':
        handlePlus();
        break;
      case 'save':
        handleSave({user});
        break;
      case 'remove':
        handleRemove({user});
        break;
      case 'key':
        handleKey({user});
      default:
        break;
    }
  };

  const handlePlus = () => {
    if (mode === Mode.USER) {
      userDataGridRef.current._instance.clearSelection();
      setUserDetailInfo(new User({}));
    }

    if (mode === Mode.GROUP) {
      setGroupDetailInfo({});
      setGroupMemberUsers({});
    }
  };

  const handleSave = ({user}) => {
    if (mode === Mode.USER) {
      const validate = userInfoRef.current._instance.validate();
      if (validate.isValid) {
        if (user.userNo === 0) {
          user.createUser()
              .then((response) => {
                if (response.data.data) {
                  user.getUser()
                      .then((users) => {
                        setUsersFormat(users);
                        setUserDetailInfo(new User({}));
                        alert('사용자 ' + user.userId + ' (을)를 ' +
                          localizedString.successSave);
                      })
                      .catch(() => {
                        throw new Error('Failure get User');
                      });
                }
              })
              .catch(() => {
                throw new Error('Failure Create User');
              });
        } else {
          user.updateUser()
              .then((response) => {
                if (response.data.data) {
                  user.getUser()
                      .then((users) => {
                        setUsersFormat(users);
                        setUserDetailInfo(new User({}));
                        alert('사용자 ' + user.userId + ' (을)를 ' +
                          localizedString.successUpdate);
                      })
                      .catch(() => {
                        throw new Error('Failure get User');
                      });
                }
              })
              .catch(() => {
                throw new Error('failure Update User');
              });
        }
      }
    }

    if (mode === Mode.GROUP) {

    }
  };

  const handleRemove = ({user}) => {
    if (mode === Mode.USER) {
      if (user.userNo !== 0) {
        user.deleteUser(user)
            .then((response) => {
              if (response.data.data) {
                user.getUser()
                    .then((users) => {
                      setUsersFormat(users);
                      setUserDetailInfo(new User({}));
                      alert('사용자 ' + user.userId + ' (을)를 ' +
                          localizedString.successRemove);
                    })
                    .catch(() => {
                      throw new Error('Failure get User');
                    });
              }
            })
            .catch(() => {
              throw new Error('failure Delete User');
            });
      };
    }

    if (mode === Mode.GROUP) {

    }
  };

  const handleKey = ({user}) => {
    if (user.userNo !== 0) {
      openModal(UserPasswordModal, {
        user: user
      });
    }
  };

  const handleTabPanelItem = ({itemData}) => {
    const panelTitle = itemData.title;
    dataSource.forEach((item) => {
      if (item.title === panelTitle) {
        setMode(item.mode);
        return;
      }
    });
  };


  const navBarItems = (mode) => {
    if (mode === Mode.USER) {
      return (
        btns.map((item, index) => (
          <NavBarItem key={index}>
            <Button icon={item} onClick={handleBtnClick}></Button>
          </NavBarItem>
        ))
      );
    } else if (mode === Mode.GROUP) {
      return (
        btns.filter((item) => item !== 'key')
            .map((item, index) => (
              <NavBarItem icon={item} key={index}>
                <Button icon={item} onClick={handleBtnClick}></Button>
              </NavBarItem>
            ))
      );
    };
  };

  return (
    <UserGroupContext.Provider
      value={context}>
      <Wrapper display='flex' direction='column'>
        <Header>
          <NavBar>
            {navBarItems(mode)}
          </NavBar>
        </Header>
        <Content>
          <TabPanel
            className='dx-theme-background-color'
            width='100%'
            height='100%'
            dataSource={dataSource}
            animationEnabled={false}
            swipeEnabled={false}
            itemComponent={TabPanelItem}
            onTitleClick={handleTabPanelItem}
          >
          </TabPanel>
        </Content>
      </Wrapper>
    </UserGroupContext.Provider>
  );
};

export default UserGroupManagement;
