import {createContext, useCallback, useRef, useState} from 'react';
import styled from 'styled-components';
import {Button, TabPanel} from 'devextreme-react';
import {Mode, dataSource} from './data/UserGroupManagementData.js';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper.jsx';
import {useLoaderData} from 'react-router-dom';
import {User} from 'models/config/userGroupManagement/UserGroupManagement.js';

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
  // const {alert} = useModal();

  const {userGroupManagement} = useLoaderData();
  const [groupsFormat, setGroupsFormat] =
  useState(userGroupManagement.groupsFormat);
  const [groupDetailInfo, setGroupDetailInfo] = useState();
  const [usersFormat, setUsersFormat] =
  useState(userGroupManagement.usersFormat);
  const [userDetailInfo, setUserDetailInfo] = useState();
  const [groupMemberUsers, setGroupMemberUsers] = useState();
  const [groupNotMemberUsers, setGroupNotMemberUsers] = useState();
  const [mode, setMode] = useState(dataSource[0].mode);

  const userInfoRef = useRef();

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
    const group = 'test';
    // const group = new User(formData);


    switch (icon) {
      case 'plus':
        handlePlus();
        break;
      case 'save':
        handleSave({user, group});
        break;
      case 'remove':
        handleRemove({user, group});
        break;
      case 'key':
        handleKey();
        break;
      default:
        break;
    }
  };

  const handlePlus = () => {
    if (mode === Mode.USER) {
      setUserDetailInfo({});
    }

    if (mode === Mode.GROUP) {
      setGroupDetailInfo({});
      setGroupMemberUsers({});
    }
  };

  const handleSave = ({user, group}) => {
    if (mode === Mode.USER) {
      const validate = userInfoRef.current._instance.validate();
      if (validate.isValid) {
        if (user.userNo === 0) {
          console.log(user);
          console.log(group);
          user.createUser()
              .then((response) => {
                if (response.data.data) {
                  console.log(usersFormat);
                  console.log(user);
                  setUserDetailInfo({});
                }
              })
              .catch(() => {
                throw new Error('failure Create User');
              });
        } else {
          user.updateUser()
              .then((response) => {
                console.log(response);
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

  const handleRemove = ({user, group}) => {
    if (mode === Mode.USER) {
      user.userNo = 2156;
      if (user.userNo !== 0) {
        console.log(user);
        user.deleteUser(user)
            .then((response) => {
              console.log(response);
            })
            .catch(() => {
              throw new Error('failure Delete User');
            });
      };
    }

    if (mode === Mode.GROUP) {

    }
  };

  // const handleKey = () => {
  //   if (userDetailInfo) {
  //     const user =
  //       usersFormat.find((user) => user.userId === userDetailInfo.userId);
  //     openModal(UserPasswordModal, {
  //       user: user
  //     });
  //   };
  // };

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
