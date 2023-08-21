import {Link, Outlet} from 'react-router-dom';
const contextPath = '/editds';
const Designer = () => {
  return (
    <div>
      디자이너 페이지
      <div>
        <ul>
          <li><Link to={contextPath + '/adhoc'}>비정형</Link></li>
          <li><Link to={contextPath + '/dash'}>대시보드</Link></li>
          <li><Link to={contextPath + '/spreadsheet'}>엑셀</Link></li>
          <li><Link to={contextPath + '/viewer'}>뷰어</Link></li>
          <li><Link to={contextPath + '/Config'}>설정</Link></li>
        </ul>
      </div>
      <Outlet/>
    </div>
  );
};
export default Designer;
