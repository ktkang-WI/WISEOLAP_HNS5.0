import {useState} from 'react';
import Collapsible from 'react-collapsible';
import reportIcon from 'assets/image/icon/button/report_folder.png';
import './Drawer.css';

const DrawerMenu = ({data, portalUrl}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menus = [
    {
      name: '즐겨찾기',
      key: 'favorites'
    },
    {
      name: '최근 보고서',
      key: 'recent'
    }
  ];

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // Drawer 외부 클릭 감지
  const closeDrawer = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  const getTrigger = (name) => {
    return <div className='menu-fld'>
      <img height='21px' src={reportIcon}/> {name} </div>;
  };

  return (
    <div className='portal-drawer'>
      <button type="button" className="menu_btn" onClick={toggleDrawer}>
        <img src={require('../img/menu_ico.png')} alt=""/>
      </button>

      {isOpen && <div className="backdrop" onClick={closeDrawer}></div>}

      <div className={`drawer ${isOpen ? 'open' : ''}`}>
        <div className='drawer-reports'>
          {
            menus.map((menu) => {
              return (
                <Collapsible
                  key={'menu-' + menu.key}
                  trigger={getTrigger(menu.name)}>
                  {(data[menu.key] || []).map((report) => {
                    return (
                      <div
                        onClick={() => {
                          // eslint-disable-next-line max-len
                          const href = `${portalUrl}/linkviewer?userId=admin&reportId=${report.id}&reportType=${report.reportType}&srl=true`;
                          const newWindow = window.open(href, '_blank');
                          if (newWindow) {
                            newWindow.focus();
                          }
                        }}
                        className='menu-report'
                        key={'menu-r-' + report.id}>
                        {report.name}
                      </div>
                    );
                  })}
                </Collapsible>
              );
            })
          }
        </div>
        <div className='drawer-quick-menu'>
          <a href='#quick_box0' className='menu-report'>주제영역 매트릭스 보고서</a>
          <a href='#quick_box1' className='menu-report'>전환보고서 안내</a>
          {/* <a href='#quick_box2' className='menu-report'>검색키워드/상품별 TOP10</a>
          <a href='#quick_box3' className='menu-report'>주문고객수/객단가</a>
          <a href='#quick_box4' className='menu-report'>클럽고객수/TV유형상품수</a> */}
        </div>
      </div>
    </div>
  );
};

export default DrawerMenu;
