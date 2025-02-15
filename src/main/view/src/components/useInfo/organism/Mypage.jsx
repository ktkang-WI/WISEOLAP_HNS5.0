import Header from 'components/common/atomic/Header/organism/Header';
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate
} from 'react-router-dom';
import localizedString from 'config/localization';
import TabMenu from 'components/config/molecules/common/TabMenu';
import {getTheme} from 'config/theme';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {useDispatch} from 'react-redux';
import ConfigSlice from 'redux/modules/ConfigSlice';
import {useEffect} from 'react';

const theme = getTheme();
const tabNm = localizedString.myPage;
const myPageUIParam =
  {
    text: tabNm,
    type: 'CustomTitle'
  };

const menuButtons = [ // label localizedString
  {value: 'user_info', text: '개인정보', path: '/mypageuserinfo'},
  {
    value: 'myDesigner_config',
    text: '디자이너 설정',
    path: '/mypagedesigner'
  },
  {value: 'myViewer_config',
    text: '뷰어 설정',
    path: '/mypageviewer'},
  // {value: 'myFont_config',
  //   text: '폰트 설정',
  //   path: '/font'},
  {value: 'myReport_folder',
    text: '개인 보고서 및 폴더 관리',
    path: '/mypagereportfolder'}
];

const MyPage = () => {
  const userNm = useLoaderData();
  const dispatch = useDispatch();
  const {setUserNm} = ConfigSlice.actions;
  const location = useLocation();
  const nav = useNavigate();
  const defaultSelection =
    menuButtons.find(({path}) => location.pathname.includes(path));

  useEffect(() => {
    if (userNm != null && userNm != '') {
      dispatch(setUserNm(userNm));
    } else {
      nav('/editds');
    }
  }, []);

  return (
    <>
      <Wrapper display='flex' direction='column'>
        <Header
          left={['Logo']}
          middle={[myPageUIParam]}
          right={[
            'ReportProperty',
            'UserInfo'
          ]}
        >
        </Header>
        <Wrapper
          display={'flex'}
          height={`calc(100% - ${theme.size.headerHeight} - 20px)`}
          direction={'row'}
        >
          <TabMenu
            style={{marginTop: '10px', marginLeft: '10px'}}
            defaultSelection={defaultSelection.value}
            init={false}
            onChangedValue={(key) => {
              const item =
                  menuButtons.find(({value}) => key == value);

              if (!item) return;

              nav('/editds' + item.path);
            }}
            items={menuButtons}
          />
          <Wrapper
            className='section'
            style={{
              borderRadius: '10px',
              border: 'solid 1px ' + theme.color.breakLine,
              background: theme.color.panelColor,
              overflow: 'hidden',
              padding: '15px'
            }}
          >
            <Outlet/>
          </Wrapper>
        </Wrapper>
      </Wrapper>
    </>
  );
};
export default MyPage;
