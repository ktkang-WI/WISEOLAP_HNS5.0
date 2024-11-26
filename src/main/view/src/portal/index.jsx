import {useState, useEffect} from 'react';
import {format, parse} from 'date-fns';
import './css/reset.css';
import './css/style.css';
import ReportBox from './components/ReportBox';
import models from 'models';
import reportIcon from './img/list_ico1.png';

import defaultIcon from './img/big_ico6.png';
import ReportSwiper from './components/ReportSwiper';
import {DateBox} from 'devextreme-react';
import {useNavigate} from 'react-router-dom';
import {bigMenuIconMapper, headerMenuHref} from './data/data';
import Header from './components/Header';
import Cards from './components/Cards';

const quickBoxs = [
  // {
  //   id: 13057,
  //   name: '주제영역 매트릭스 보고서'
  // },
  // {
  //   id: 13350,
  //   name: '전환보고서 안내'
  // }
];

const Portal = ({admin = false}) => {
  const PORTAL_URL = window.location.origin + '/editds';

  const nav = useNavigate();
  const auth = admin ? 'admin' : 'user';
  const [date, setDate] = useState(null);
  const [types, setTypes] = useState([]);
  const [reportIds, setReportIds] = useState({});
  const [type, setType] = useState('');
  const [team, setTeam] = useState('전체');

  const [maxDate, setMaxDate] = useState(new Date());
  const [reportList, setReportList] = useState([]);
  const [folderMap, setFolderMap] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const folders = [2343, 2353, 2355, 2351, 2349, 2347, 2345, 2348, 2358];
  // folders.push(1621, 1781, 2221);
  const [userId, setUserId] = useState('');
  const [userNm, setUserNm] = useState('');

  useEffect(() => {
    models.Login.sessionCheck().catch(({response}) => {
      if (response.status = 401) {
        nav('/editds');
      }
    });
  }, [nav]);

  useEffect(() => {
    models.Portal.getPortalInfo(auth).then((data) => {
      if (data.status == 200) {
        setTypes(data?.data?.types.map(({name}) => name) || []);
        setType(data?.data?.types[0].name);
        const reports = data?.data?.reports.reduce((acc, report) => {
          if (!acc[report.type]) {
            acc[report.type] = [];
          }

          acc[report.type].push(report.reportId);

          return acc;
        }, {});
        setReportIds(reports);
      }
      console.log(data?.data);
    });
    // 3600000
    const itv = setInterval(() => {
      models.Portal.getMaxDate().then((data) => {
        if (data.status === 200) {
          const newDate = parse(data.data + '', 'yyyyMMdd', new Date());
          setMaxDate(newDate);
          setDate(newDate);
        } else {
          const defaultDate = new Date();
          defaultDate.setDate(defaultDate.getDate() - 1);

          setMaxDate(defaultDate);
          setDate(defaultDate);
        }
      });
    }, 3600000);

    return () => clearInterval(itv);
  }, []);

  useEffect(() => {
    models.Portal.getTeamList(format(date, 'yyyyMMdd')).then((data) => {
      if (data.status == 200) {
        setTeamList(data.data);
      } else {
        setTeamList([]);
      }
    });
  }, [date]);

  useEffect(() => {
    if (!date || !type) return;

    models.Portal.getCardData(auth, format(date, 'yyyyMMdd'), type, team)
        .then((data) => {
          if (data.status == 200 && data.data) {
            setCardData(data.data);
          }
        });
  }, [auth, date, type, team]);

  useEffect(() => {
    models.Report.getUserInfo().then((data) => {
      if (data.status == 200) {
        if (admin && data.data.userId == 'admin') {
          nav('/editds/portal');
        }
        setUserId(data.data.userId);
        setUserNm(data.data.userNm);
      }
    });

    models.Portal.getMaxDate().then((data) => {
      if (data.status === 200) {
        const newDate = parse(data.data + '', 'yyyyMMdd', new Date());
        setMaxDate(newDate);
        setDate(newDate);
      }
    });

    models.Report.getPortalMenuList(folders).then((data) => {
      if (data.status == 200) {
        const publicReport = data.data;

        const _folderMap = publicReport.reduce((acc, curr) => {
          if (curr.type === 'FOLDER') {
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
          if (curr.type === 'REPORT' && _folderMap[curr.rootFldId]) {
            _folderMap[curr.rootFldId].reports.push(curr);
          }
        });

        const result = Object.values(_folderMap).map((fld) => {
          // 폴더 안의 리포트들을 ordinal, id 순으로 정렬
          fld.reports.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
          return fld;
        });

        console.log(result);
        result.sort((a, b) => {
          if (a.name == '부서별 폴더') return -1;
          if (b.name == '부서별 폴더') return 1;

          if (a.ordinal !== b.ordinal) {
            return a.ordinal - b.ordinal;
          }
          return a.id - b.id;
        });

        setFolderMap(_folderMap);
        setReportList(result);
      }
    });
  }, []);

  const getReports = (reports) => {
    return reports?.map((report) => (
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

  const getQuickBoxs = () => {
    return quickBoxs?.map(({id, name}, i) => {
      const url = `${PORTAL_URL}/linkviewer?userId=${userId}&reportId=${id}`;
      return (
        <div id={'quick_box' + i} key={'quick_box' + i}>
          <div className="grap_box_title"
            onClick={() => {
              const href = `${url}&srl=true`;
              const newWindow = window.open(href, '_blank');
              if (newWindow) {
                newWindow.focus();
              }
            }}
          >{name}</div>
          <div className="graph_box_wrap">
            <iframe
              width='100%'
              height='600px'
              src={`${url}&no_header=true&no_filter=true&portal=true`}/>
          </div>
        </div>
      );
    });
  };

  const getBottomReportList = () => {
    return (<div className='blue_bg'>
      <div className='contents'>
        {
          reportList?.map((fld) => {
            if (fld.reports.length > 0) {
              return (
                <div className="file_box" key={fld.id} id={'fld' + fld.id}>
                  <p>
                    <img src={bigMenuIconMapper[fld.name] || defaultIcon}/>
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
    </div>);
  };

  return (
    <div id='top' className='portal'>
      <Header
        PORTAL_URL={PORTAL_URL}
        folderMap={folderMap}
        headerMenuHref={headerMenuHref}
        userNm={userNm}
        useAdminButton={userId == 'admin'}
        admin={admin}
      />
      <div className='contents'>
        <div className='round_box pay_box_wrap'>
          <ul>
            <li>
              <p>기준년월일</p>
              <DateBox
                value={date}
                buttons={[]}
                max={maxDate}
                onValueChanged={(e) => setDate(e.value)}
                displayFormat={(date) => {
                  if (!date) return '';

                  const days = ['일', '월', '화', '수', '목', '금', '토'];
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  const dayOfWeek = days[date.getDay()];

                  return `${year}.${month}.${day}(${dayOfWeek})`;
                }}
                focusStateEnabled={false}
                hoverStateEnabled={false}
                openOnFieldClick={true}
              ></DateBox>
            </li>
            <li className='pay_box_button_wrap'>
              {
                types.map((title, i) =>
                  <div
                    key={`pay_box${i}`}
                    className={'pay_box_button' +
                      (title == type ? ' active' : '')
                    }
                    onClick={(e) => {
                      setType(title);
                    }}
                  >
                    {title}
                  </div>
                )
              }
            </li>
            {admin &&
              <li>
                <select
                  onChange={(e) => setTeam(e.target.value)}
                  className="select"
                >
                  <option value="전체">팀(전체)</option>
                  {teamList.map(({MD_TEAM_NM}, i) => {
                    return <option key={i} value={MD_TEAM_NM}>
                      {MD_TEAM_NM}
                    </option>;
                  })}
                </select>
              </li>
            }
          </ul>
          <Cards cardData={cardData}/>
        </div>
        <ReportSwiper
          type={type}
          portalUrl={PORTAL_URL}
          reportIds={reportIds}
          date={date}
          team={team}
          userId={userId}
          admin={admin}
        />
        {getQuickBoxs()}
      </div>
      {!admin && getBottomReportList()}
    </div>
  );
};

export default Portal;
