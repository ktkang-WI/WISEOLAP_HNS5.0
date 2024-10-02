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

const Portal = () => {
  const PORTAL_URL = 'http://10.2.3.51:18080/editds';
  const [date, setDate] = useState(format(new Date(), 'yyyy.MM.dd'));
  const [reportList, setReportList] = useState([]);
  const [portalReportList, setPortalReportList] = useState({});
  const [cardData, setCardData] = useState([]);
  const avFolders =
    new Set([2353, 2355, 2351, 2349, 2345, 2348, 2358]);

  useEffect(() => {
    models.Portal.getCardData(date.replaceAll('.', '')).then((data) => {
      if (data.status == 200 && data.data) {
        setCardData(data.data);
      }
    });
  }, [date]);

  useEffect(() => {
    models.Report.getList(null, 'viewer').then((data) => {
      if (data.status == 200) {
        const {publicReport} = data.data;

        const folderMap = publicReport.reduce((acc, curr) => {
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
          if (curr.type === 'REPORT' && folderMap[curr.upperId]) {
            folderMap[curr.upperId].reports.push(curr);
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
      onSelect: (dateText) => setDate(dateText)
    });
  }, []);

  const getReports = (reports) => {
    return reports.map((report) => (
      <ReportBox
        // eslint-disable-next-line max-len
        href={`${PORTAL_URL}/linkviewer?userId=admin&reportId=${report.id}&reportType=${report.reportType}&no_header=true`}
        key={report.uniqueId}
        title={report.name}
        date={format(new Date(report.modDt), 'yyyy.MM.dd.')}
        report={report}
        icon={reportIcon}
      />
    ));
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
            <li>
              <a
                href={`${PORTAL_URL}/linkviewer?srl=true&fld=2353`}
                rel="noreferrer"
                target="_blank"
                className='active'>
                전사관리지표
              </a>
              <a
                href={`${PORTAL_URL}/linkviewer?srl=true&fld=2355`}
                rel="noreferrer"
                target="_blank">
                주요보고서
              </a>
              <a
                href={`${PORTAL_URL}/linkviewer?srl=true&fld=2351`}
                rel="noreferrer"
                target="_blank">
                상품
              </a>
              <a
                href={`${PORTAL_URL}/linkviewer?srl=true&fld=2349`}
                rel="noreferrer"
                target="_blank">
                방송
              </a>
              <a
                href={`${PORTAL_URL}/linkviewer?srl=true`}
                rel="noreferrer"
                target="_blank">
                주문
              </a>
              <a
                href={`${PORTAL_URL}/linkviewer?srl=true&fld=2345`}
                rel="noreferrer"
                target="_blank">
                고객
              </a>
              <a
                href={`${PORTAL_URL}/linkviewer?srl=true&fld=2348`}
                rel="noreferrer"
                target="_blank">
                물류
              </a>
              <a
                href={`${PORTAL_URL}/linkviewer?srl=true&fld=2358`}
                rel="noreferrer"
                target="_blank">
                기타
              </a>
              <a
                href={`${PORTAL_URL}`}
                rel="noreferrer"
                target="_blank">
                OLAP</a>
            </li>
          </ul>
          <DrawerMenu data={portalReportList}/>
        </div>
      </div>
      <div className='contents'>
        <div className='round_box pay_box_wrap'>
          <ul>
            <li>
              <p>기준년월일</p>
              <input
                type='text'
                value={date}
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
        <iframe
          width='100%'
          height='2400px'
          // eslint-disable-next-line max-len
          src={`${PORTAL_URL}/linkviewer?userId=admin&reportId=13154&no_header=true&reportType=DashAny&no_filter=true&portal=true&param_values=%7B%22@DATE%22:%5B%22${date.replaceAll('.', '')}%22%5D%7D`}
        ></iframe>
      </div>
      <div className='blue_bg'>
        <div className='contents'>
          {
            reportList.map((fld) => {
              if (fld.reports.length > 0) {
                return (
                  <div className="file_box" key={fld.id} id={'fld' + fld.id}>
                    <p>{fld.name}</p>
                    <ul>
                      {getReports(fld.reports)}
                    </ul>
                  </div>);
              } else {
                return (
                  <div className="file_box" key={fld.id} id={'fld' + fld.id}>
                    <p>{fld.name}</p>
                    <div className='no-card'> 보고서가 없습니다 </div>
                  </div>
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
