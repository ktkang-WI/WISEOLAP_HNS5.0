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

  useEffect(() => {
    models.Report.getList(null, 'viewer').then((data) => {
      if (data.status == 200) {
        const {publicReport} = data.data;

        const folderMap = publicReport.reduce((acc, curr) => {
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
        href={`http://localhost:3000/editds/linkviewer?reportId=${report.id}&reportType=${report.reportType}&no_header=true`}
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
              <a href='#n' className='active'>전사관리지표</a>
              <a href='#fld-100'>주요보고서</a>
              <a href='#n'>상품</a>
              <a href='#n'>방송</a>
              <a href='#n'>주문</a>
              <a href='#n'>고객</a>
              <a href='#n'>물류</a>
              <a href='#n'>기타</a>
              <a href='#n'>OLAP</a>
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
          <Card
            title='매출액'
            amount='3,600'
            percentData={{previous: '98.6%', plan: '107.6%'}}
            imgSrc='./img/con_bg1.png'
          />
          <Card
            title='목표취급액'
            amount='3,600'
            percentData={{previous: '98.6%', plan: '107.6%'}}
            imgSrc='./img/con_bg2.png'
          />
          <Card
            title='목표공헌이익'
            amount='3,600'
            percentData={{previous: '98.6%', plan: '107.6%'}}
            imgSrc='./img/con_bg3.png'
          />
          <Card
            title='UV'
            amount='1,500'
            percentData={{previous: '103.7%', plan: '103.1%'}}
            imgSrc='./img/con_bg4.png'
          />
        </div>
        <iframe
          width='100%'
          height='1200px'
          src='http://localhost:3000/editds/linkviewer?token=412a8ce2-7bfe-4f08-803a-28104507378d&no_header=true&portal=true'
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
                return null;
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
