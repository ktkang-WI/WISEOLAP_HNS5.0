import {useState, useEffect} from 'react';
import {format} from 'date-fns';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui/themes/base/all.css';
import './css/reset.css';
import './css/style.css';
import ReportBox from './components/ReportBox';
import Card from './components/Card';
import models from 'models';
import reportIcon from './img/list_ico1.png';
import DrawerMenu from './components/Drawer';
import UserInfoButtonUI
  from 'components/common/atomic/Header/atom/UserInfoButtonUI';
import UserInfoPopover
  from 'components/common/atomic/Header/popover/UserInfoPopover';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';

import bigMenuIcon1 from './img/big_ico1.png';
import bigMenuIcon2 from './img/big_ico2.png';
import bigMenuIcon3 from './img/big_ico3.png';
import bigMenuIcon4 from './img/big_ico4.png';
import bigMenuIcon5 from './img/big_ico5.png';
import bigMenuIcon6 from './img/big_ico6.png';
import ReportSwiper from './components/ReportSwiper';

const bigMenuIconMapper = {
  '고객': bigMenuIcon1,
  '전사관리지표': bigMenuIcon2,
  '매출': bigMenuIcon3,
  '물류': bigMenuIcon4,
  '상품': bigMenuIcon5
};

const headerMenuHref = [
  {
    name: '전사관리지표',
    fld: '2353'
    // fld: '1621'
  },
  {
    name: '주요보고서',
    fld: '2355'
  },
  {
    name: '상품',
    fld: '2351'
  },
  {
    name: '방송',
    fld: '2349'
  },
  {
    name: '매출',
    fld: '2347'
  },
  {
    name: '고객',
    fld: '2345'
  },
  {
    name: '물류',
    fld: '2348'
  },
  {
    name: '기타',
    fld: '2358'
  }
];

const Portal = () => {
  // const PORTAL_URL = 'https://olap.hns.tv:8080/editds';
  // const PORTAL_URL = 'http://localhost:3000/editds';
  const PORTAL_URL = window.location.origin + '/editds';
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() - 1);

  const [date, setDate] = useState(format(defaultDate, 'yyyy.MM.dd'));
  const [reportList, setReportList] = useState([]);
  const [folderMap, setFolderMap] = useState([]);
  const [portalReportList, setPortalReportList] = useState({});
  const [cardData, setCardData] = useState([]);
  const avFolders =
    new Set([2343, 2353, 2355, 2351, 2349, 2347, 2345, 2348, 2358]);
  const [userId, setUserId] = useState('');
  const [userNm, setUserNm] = useState('');

  useEffect(() => {
    models.Report.getUserInfo().then((data) => {
      if (data.status == 200) {
        setUserId(data.data.userId);
        setUserNm(data.data.userNm);
      }
    });

    models.Portal.getCardData(format(date, 'yyyyMMdd')).then((data) => {
      if (data.status == 200 && data.data) {
        setCardData(data.data);
      }
    });

    // 3600000
    const itv = setInterval(() => {
      setDate(new Date());
    }, 3600000);

    return () => clearInterval(itv);
  }, [date]);

  useEffect(() => {
    models.Report.getList(null, 'viewer').then((data) => {
      if (data.status == 200) {
        const {publicReport} = data.data;

        const _folderMap = publicReport.reduce((acc, curr) => {
          if (curr.type === 'FOLDER' && avFolders.has(curr.id)) {
          // if (curr.type === 'FOLDER') {
            acc[curr.id] = {
              id: curr.id,
              name: curr.name,
              ordinal: curr.ordinal,
              reports: []
            };
          }
          return acc;
        }, {});

        publicReport.forEach((curr) => {
          if (curr.type === 'REPORT' && _folderMap[curr.upperId]) {
            _folderMap[curr.upperId].reports.push(curr);
          }
        });

        const result = Object.values(folderMap).map((fld) => {
          // 폴더 안의 리포트들을 ordinal, id 순으로 정렬
          fld.reports.sort((a, b) => {
            if (a.ordinal !== b.ordinal) {
              return a.ordinal - b.ordinal;
            }
            return a.id - b.id;
          });
          return fld;
        });

        result.sort((a, b) => {
          if (a.ordinal !== b.ordinal) {
            return a.ordinal - b.ordinal;
          }
          return a.id - b.id;
        });

        setFolderMap(_folderMap);
        setReportList(result);
      }
    });

    models.Report.getPortalList().then((data) => {
      if (data.status == 200) {
        setPortalReportList(data.data);
      }
    });
  }, []);

  useEffect(() => {
    $('.date').datepicker({
      dateFormat: 'yy.mm.dd',
      onSelect: (dateText) => {
        const selectedDate = $.datepicker.parseDate('yy.mm.dd', dateText);
        setDate(selectedDate);
      }
    });
  }, []);

  const getReports = (reports) => {
    return reports.map((report) => (
      <ReportBox
        // eslint-disable-next-line max-len
        href={`${PORTAL_URL}/linkviewer?reportId=${report.id}&reportType=${report.reportType}&srl=true`}
        key={report.uniqueId}
        title={report.name}
        date={format(new Date(report.modDt), 'yyyy.MM.dd.')}
        report={report}
        icon={reportIcon}
      />
    ));
  };

  const getDropdown = (id) => {
    return (
      <div className='depth_menu' key={'d' + id}>
        <ul>
          {
            folderMap[id]?.reports?.map((r) => {
              return (
                <li key={'rd'+id}>
                  <a href={`${PORTAL_URL}/linkviewer?srl=true&fld=${id}` +
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
    <div id='top' className='portal'>
      <div id='header'>
        <div className='header_wrap'>
          <a href='#n' id='logo'>
            <img src={require('./img/logo.png')} alt='' />
          </a>
          <a type="button" className="menu_btn top_btn" href='#header'>
            ↑
          </a>
          <ul id='header_menu'>
            {
              headerMenuHref.map((menu, i) => {
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
                href={`${PORTAL_URL}/`}
                rel="noreferrer"
                target="_blank"
                className='active'>
                OLAP</a>
            </li>
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
            <UserInfoButtonUI name={userNm}/>
          </CommonButton>
          <DrawerMenu portalUrl={PORTAL_URL} data={portalReportList}/>
        </div>
      </div>
      <div className='contents'>
        <div className='round_box pay_box_wrap'>
          <ul>
            <li>
              <p>기준년월일</p>
              <input
                type='text'
                value={format(date, 'yyyy.MM.dd')}
                className='date'
                readOnly
              />
            </li>
          </ul>
          {
            cardData.map((d, i) => {
              return (
                <Card
                  title={d['구분']}
                  key={'card' + i}
                  amount={d['금액']}
                  percentData={{previous: d['전년비'], plan: d['계획비']}}
                  imgSrc={require('./img/con_bg' + (i + 1) + '.png')}
                />
              );
            })
          }
          {
            cardData.length == 0 &&
              <div className='no-card'> 조회된 데이터가 없습니다. </div>
          }
        </div>
        <ReportSwiper portalUrl={PORTAL_URL} date={date} userId={userId}/>
        <div style={{display: 'none'}}>
          <div id="quick_box0">
            <div className="grap_box_title">예상/실현 실적</div>
            <div className="graph_box_wrap">
              <div className="round_box">
                <div className="box_title">
                  <img src="./img/title_ico1.png" alt=""/>
                  <span>타이틀</span>
                </div>
                <div className="graph" style={{'height': '300px'}}>
                  그래프가 들어갈 곳입니다.
                </div>
              </div>
              <div className="round_box">
                <div className="box_title">
                  <img src="./img/title_ico2.png" alt=""/>
                  <span>타이틀</span>
                </div>
                <div className="graph" style={{'height': '300px'}}>
                  그래프가 들어갈 곳입니다.
                </div>
              </div>
            </div>
          </div>
          <div id="quick_box1">
            <div className="grap_box_title">공헌이익/누적분당효율</div>
            <div className="graph_box_wrap">
              <div className="round_box">
                <div className="box_title">
                  <img src="./img/title_ico1.png" alt=""/>
                  <span>타이틀</span>
                </div>
                <div className="graph" style={{'height': '300px'}}>
                  그래프가 들어갈 곳입니다.
                </div>
              </div>
              <div className="round_box">
                <div className="box_title">
                  <img src="./img/title_ico2.png" alt=""/>
                  <span>타이틀</span>
                </div>
                <div className="graph" style={{'height': '300px'}}>
                  그래프가 들어갈 곳입니다.
                </div>
              </div>
            </div>
          </div>
          <div id="quick_box2">
            <div className="grap_box_title">검색키워드/상품별 TOP 10</div>
            <div className="graph_box_wrap">
              <div className="round_box">
                <div className="box_title">
                  <img src="./img/title_ico1.png" alt=""/>
                  <span>타이틀</span>
                </div>
                <div className="graph" style={{'height': '300px'}}>
                  그래프가 들어갈 곳입니다.
                </div>
              </div>
              <div className="round_box">
                <div className="box_title">
                  <img src="./img/title_ico2.png" alt=""/>
                  <span>타이틀</span>
                </div>
                <div className="graph" style={{'height': '300px'}}>
                  그래프가 들어갈 곳입니다.
                </div>
              </div>
            </div>
          </div>
          <div id="quick_box3">
            <div className="grap_box_title">주문고객수/객단가</div>
            <div className="graph_box_wrap">
              <div className="round_box">
                <div className="box_title">
                  <img src="./img/title_ico1.png" alt=""/>
                  <span>타이틀</span>
                </div>
                <div className="graph" style={{'height': '300px'}}>
                  그래프가 들어갈 곳입니다.
                </div>
              </div>
              <div className="round_box">
                <div className="box_title">
                  <img src="./img/title_ico2.png" alt=""/>
                  <span>타이틀</span>
                </div>
                <div className="graph" style={{'height': '300px'}}>
                  그래프가 들어갈 곳입니다.
                </div>
              </div>
            </div>
          </div>
          <div id="quick_box4">
            <div className="grap_box_title">클럽고객수/TV유형상품수</div>
            <div className="graph_box_wrap">
              <div className="round_box">
                <div className="box_title">
                  <img src="./img/title_ico1.png" alt=""/>
                  <span>타이틀</span>
                </div>
                <div className="graph" style={{'height': '300px'}}>
                  그래프가 들어갈 곳입니다.
                </div>
              </div>
              <div className="round_box">
                <div className="box_title">
                  <img src="./img/title_ico2.png" alt=""/>
                  <span>타이틀</span>
                </div>
                <div className="graph" style={{'height': '300px'}}>
                  그래프가 들어갈 곳입니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='blue_bg'>
        <div className='contents'>
          {
            reportList.map((fld) => {
              if (fld.reports.length > 0) {
                return (
                  <div className="file_box" key={fld.id} id={'fld' + fld.id}>
                    <p>
                      <img src={bigMenuIconMapper[fld.name] || bigMenuIcon6}/>
                      {fld.name}
                    </p>
                    <ul>
                      {getReports(fld.reports)}
                    </ul>
                  </div>);
              } else {
                return (
                  null
                );
              }
            }
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Portal;
