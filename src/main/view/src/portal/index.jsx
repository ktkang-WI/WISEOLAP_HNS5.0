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
import icon from './img/list_ico1.png';

const App = () => {
  const [date, setDate] = useState(format(new Date(), 'yyyy.MM.dd'));
  const [reportList, setReportList] = useState([]);
  const [cardData, setCardData] = useState([]);
  const avFolders = new Set([2282, 2283, 2284, 2285, 2286, 2287, 2288, 2290]);

  useEffect(() => {
    models.Portal.getCardData(date.replaceAll('.', '')).then((data) => {
      if (data.status == 200) {
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

        // 3. 객체 맵을 다시 배열로 변환하여 정렬
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

        console.log(result);

        setReportList(result);
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
        href={`https://olap.hns.tv:8080/editds/linkviewer?reportId=${report.id}&reportType=${report.reportType}&no_header=true`}
        key={report.uniqueId}
        title={report.name}
        date={format(new Date(report.modDt), 'yyyy.MM.dd.')}
        description={report.reportDesc}
        icon={icon}
      />
    ));
  };

  return (
    <div className='portal'>
      <div id='header'>
        <div className='header_wrap'>
          <a href='#n' id='logo'>
            <img src='./img/logo.png' alt='' />
          </a>
          <ul id='header_menu'>
            <li>
              <a href='#fld-2290' className='active'>전사관리지표</a>
              <a href='#fld-2282'>주요보고서</a>
              <a href='#fld-2283'>상품</a>
              <a href='#fld-2284'>방송</a>
              <a href='#fld-2285'>주문</a>
              <a href='#fld-2286'>고객</a>
              <a href='#fld-2287'>물류</a>
              <a href='#fld-2288'>기타</a>
              <a href='https://olap.hns.tv:8080/editds'>OLAP</a>
            </li>
          </ul>
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
                  imgSrc='./img/con_bg1.png'
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
          height='1200px'
          src={`http://olap.hns.tv:8080/editds/linkviewer?reportId=13154&no_header=true&reportType=DashAny&no_filter=true&portal=true&param_values=%7B%22@DATE%22:%5B%22${date.replaceAll('.', '')}%22%5D%7D`}
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

export default App;
