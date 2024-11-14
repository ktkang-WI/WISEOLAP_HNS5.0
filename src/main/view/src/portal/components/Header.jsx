import UserInfoButtonUI from
  'components/common/atomic/Header/atom/UserInfoButtonUI';
import DrawerMenu from './Drawer';
import UserInfoPopover
  from 'components/common/atomic/Header/popover/UserInfoPopover';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import {useEffect, useState} from 'react';
import models from 'models';

const Header = ({
  PORTAL_URL,
  headerMenuHref,
  userNm,
  folderMap,
  useAdminButton,
  admin
}) => {
  const [portalReportList, setPortalReportList] = useState({});

  useEffect(() => {
    models.Report.getPortalList().then((data) => {
      if (data.status == 200) {
        setPortalReportList(data.data);
      }
    });
  }, []);

  const getDropdown = (id) => {
    return (
      <div className='depth_menu' key={'d' + id}>
        <ul>
          {
            folderMap[id]?.reports?.map((r) => {
              return (
                <li key={'rd'+id}>
                  <a href={`${PORTAL_URL}/linkviewer?srl=true` +
                  `&reportId=${r.id}&reportType=${r.reportType}`}
                  rel="noreferrer"
                  target="_blank">
                    <span>{r.name}</span>
                  </a>
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  };

  return (
    <div id='header'>
      <div className='header_wrap'>
        <a href='#n' id='logo'>
          <img src={require('../img/logo.png')} alt='' />
        </a>
        <a type="button" className="menu_btn top_btn" href='#header'>
          ↑
        </a>
        <ul id='header_menu'>
          {
            headerMenuHref?.map((menu, i) => {
              if (!folderMap[menu.fld]?.reports?.length) return null;

              return (
                <li key={'li' + i}>
                  <a>{menu.name}</a>
                  {getDropdown(menu.fld)}
                </li>
              );
            })
          }
          <li>
            <a
              href={`${PORTAL_URL}/viewer`}
              rel="noreferrer"
              target="_blank"
              className='active'>
              OLAP</a>
          </li>
          {useAdminButton &&
            <li>
              <a
                href={`${PORTAL_URL}/${!admin ? 'ad' : ''}portal`}
                rel="noreferrer"
                target="_blank"
                className='active'>
                {admin ? '일반 뷰어' : '관리자 뷰어'}
              </a>
            </li>
          }
        </ul>
        <CommonButton
          id={'portal_user_info'}
          type={'onlyImageText'}
          height={'32px'}
          width={'100px'}
          usePopover={true}
          popoverProps={{
            'width': 'auto',
            'height': '80',
            'showEvent': 'click',
            'position': 'bottom'
          }}
          contentRender={() => <UserInfoPopover/>}
        >
          <UserInfoButtonUI name={userNm} />
        </CommonButton>
        <DrawerMenu portalUrl={PORTAL_URL} data={portalReportList} />
      </div>
    </div>
  );
};

export default Header;
