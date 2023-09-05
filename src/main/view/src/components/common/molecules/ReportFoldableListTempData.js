import excelFile from '../../../assets/image/icon/report/excel_file.png';
import adhoc from '../../../assets/image/icon/report/adhoc.png';
import folderLoad from '../../../assets/image/icon/report/folder_load.png';
import dash from '../../../assets/image/icon/report/dash.png';

const tempData = {
  'publicReport': [{
    ID: '1',
    name: '01. 개발테스트',
    expanded: true,
    icon: folderLoad
  }, {
    ID: '1_1',
    categoryId: '1',
    name: '01. 공통(본사)',
    expanded: true,
    icon: folderLoad
  }, {
    ID: '1_1_1',
    categoryId: '1_1',
    name: '부처별 근무인력현황',
    icon: dash
  }, {
    ID: '1_1_2',
    categoryId: '1_1',
    name: '일반직공무원_징계현황',
    icon: excelFile
  }, {
    ID: '1_1_3',
    categoryId: '1_1',
    name: '직군별 공무원 근무인력 현황',
    icon: adhoc
  }, {
    ID: '1_2',
    categoryId: '1',
    name: '02. WI 구축사례',
    expanded: true,
    icon: folderLoad
  }, {
    ID: '1_2_1',
    categoryId: '1_2',
    name: '국방부',
    expanded: true,
    icon: folderLoad
  }, {
    ID: '1_2_1_1',
    categoryId: '1_2_1',
    name: '군위탁 교육 현황',
    icon: dash
  }, {
    ID: '1_2_1_2',
    categoryId: '1_2_1',
    name: '군간부 여성인력 현황',
    icon: dash
  }, {
    ID: '1_2_1_3',
    categoryId: '1_2_1',
    name: '최근 5개년 공군조종사 전역현황',
    icon: dash
  }, {
    ID: '1_1_2_5',
    categoryId: '1_1_2',
    name: 'SuperLCD 70',
    icon: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/9.png',
    icon: adhoc
  }, {
    ID: '1_2_2',
    categoryId: '1_2',
    name: '교육',
    expanded: true,
    icon: folderLoad
  }, {
    ID: '1_2_2_1',
    categoryId: '1_2_2',
    name: '외국인 유학생 현황',
    icon: adhoc
  }, {
    ID: '1_2_2_2',
    categoryId: '1_2_2',
    name: '한국유형별 졸업 후 상황',
    icon: adhoc
  }, {
    ID: '1_2_2_3',
    categoryId: '1_2_2',
    name: '행정구역별 다문화가정 학생 수',
    icon: dash
  }, {
    ID: '1_2_3',
    categoryId: '1_2',
    name: '금융',
    expanded: true,
    icon: folderLoad
  }, {
    ID: '1_2_3_1',
    categoryId: '1_2_3',
    name: '운용사별 운용현황',
    icon: excelFile
  }],
  'privateReport': [{
    ID: '1',
    name: '01. 개인폴더',
    expanded: true,
    icon: folderLoad
  }, {
    ID: '1_1',
    categoryId: '1',
    name: '01. 공통',
    expanded: true,
    icon: folderLoad
  }, {
    ID: '1_1_1',
    categoryId: '1_1',
    name: '관리자 비정형 테스트',
    icon: adhoc
  }, {
    ID: '1_1_2',
    categoryId: '1_1',
    name: '구인구직 종합 통계표',
    icon: excelFile
  }, {
    ID: '1_1_3',
    categoryId: '1_1',
    name: '서울시 어린이 교통사고 현황',
    icon: adhoc
  }, {
    ID: '1_2',
    categoryId: '1',
    name: '02. 내폴더',
    expanded: true,
    icon: folderLoad
  }, {
    ID: '1_2_1',
    categoryId: '1_2',
    name: '사업지1',
    expanded: true,
    icon: folderLoad
  }, {
    ID: '1_2_1_1',
    categoryId: '1_2_1',
    name: '사업지1 대시보드 테스트',
    icon: dash
  }, {
    ID: '1_2_1_2',
    categoryId: '1_2_1',
    name: '사업지1 비정형 테스트',
    icon: adhoc
  }, {
    ID: '1_2_1_3',
    categoryId: '1_2_1',
    name: '사업지1 엑셀 테스트',
    icon: excelFile
  }, {
    ID: '1_2_2',
    categoryId: '1_2',
    name: '사업지2',
    expanded: true,
    icon: folderLoad
  }, {
    ID: '1_2_2_1',
    categoryId: '1_2_2',
    name: '사업지2 대시보드 테스트',
    icon: dash
  }, {
    ID: '1_2_2_2',
    categoryId: '1_2_2',
    name: '사업지2 비정형 테스트',
    icon: adhoc
  }, {
    ID: '1_2_2_3',
    categoryId: '1_2_2',
    name: '사업지2 엑셀 테스트',
    icon: excelFile
  }]
};


export default tempData;
