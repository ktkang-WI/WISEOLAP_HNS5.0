import {useState} from 'react';
import Collapsible from 'react-collapsible';
import './Drawer.css';

const DrawerMenu = ({data}) => {
  const [isOpen, setIsOpen] = useState(false);

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
    return <div className='menu-fld'> {name} </div>;
  };

  return (
    <div>
      <button type="button" className="menu_btn" onClick={toggleDrawer}>
        <img src={require('../img/menu_ico.png')} alt=""/>
      </button>

      {isOpen && <div className="backdrop" onClick={closeDrawer}></div>}

      <div className={`custom-scrollbar drawer ${isOpen ? 'open' : ''}`}>
        {
          data.map((fld) => {
            if (fld.reports.length == 0) return null;
            return (
              <Collapsible
                key={'menu-' + fld.id}
                trigger={getTrigger(fld.name)}>
                {fld.reports.map((report) => {
                  return (
                    <div
                      onClick={() => {
                        const href = `http://10.2.3.51:18080/editds/linkviewer?userId=admin&reportId=${report.id}&reportType=${report.reportType}&no_header=true`;
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
    </div>
  );
};

export default DrawerMenu;
