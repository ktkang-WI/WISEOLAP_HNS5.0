import _ from 'lodash';

/**
 * 매개변수의 기본 데이터 구조 생성
 * order의 경우 information의 최대값 order - 1 사용
 * @param {string} name
 * @param {number} dsId
 * @param {string} dsType
 * @param {number} order
 * @return {JSON}
 */
const newParamInformation = (name, dsId, dsType, order = 1) => {
  return {
    name: name, // 매개변수 명
    caption: name.substring(1), // 매개변수 캡션
    dataType: 'STRING', // 데이터 유형(STRING, NUMBER, DATE)
    paramType: 'LIST', // 매개변수 유형(LIST, INPUT, CALENDAR)
    operation: 'IN', // 조건 명(IN, NOT_IN, EQUALS, BETWEEN)
    order: order, // 매개변수 순서
    lineBreak: false, // 줄바꿈 여부
    useSearch: false, // 데이터 검색(리스트 매개변수 내 검색)
    width: 300, // 넓이
    visible: true, // 매개변수 표시 여부
    useCaptionWidth: false, // 캡션 넓이 커스텀 지정 여부
    captionWidth: null, // useCaptionWidth가 true일시 지정되는 값
    defaultValue: ['', ''], // 기본값(타입마다 다름)
    defaultValueUseSql: false, // 기본값 Sql 쿼리 사용
    exceptionValue: '', // 기존 where_clause, 전체나 비어있는 값 입력시 들어가는 값
    dsId: dsId, // 데이터 원본 정보, 주제영역 사용시 CUBE_ID로 사용
    dsType: dsType, // 데이터 원본 타입
    // CUBE or DS_SINGLE Only Use
    orgField: '', // 주제영역, 단일 테이블의 경우 조회를 위해 원본 데이터 항목 키값 저장

    // List Type Value
    dataSourceType: 'TABLE', // 데이터 원본 타입 (QUERY, TABLE)
    dataSource: '', // 데이터 원본
    itemCaption: '', // 리스트에 보여줄 값
    itemKey: '', // 조회할 때 실제로 쿼리에 들어가는 값
    sortBy: '', // 정렬 기준 항목
    sortOrder: 'ASC', // 정렬 방법(ASC, DESC)
    multiSelect: false, // 다중 선택
    useAll: true, // 전체 항목 표시 여부
    linkageFilters: [] // 연계 필터를 사용하는 경우 매개변수 이름을 담아놓는 배열
  };
};


/**
 * 타입을 변경하면서 사용하지 않게 된 값 삭제
 * @param {JSON} param parameterInformation
 * @return {JSON}
 */
const sanitizeParamInformation = (param) => {
  const info = _.cloneDeep(param);

  const deleteCalendarValue = () => {
    delete info.calendarMaxValue;
    delete info.calendarKeyFormat;
    delete info.calendarCaptionFormat;
    delete info.calendarDefaultType;
    delete info.calendarPeriodBase;
    delete info.calendarPeriodValue;
  };

  const deleteListValue = () => {
    delete info.dataSourceType;
    delete info.dataSource;
    delete info.itemCaption;
    delete info.itemKey;
    delete info.sortBy;
    delete info.sortOrder;
    delete info.multiSelect;
    delete info.useAll;
    delete info.linkageFilters;
  };


  if (info.paramType == 'LIST' || info.paramType == 'INPUT') {
    deleteCalendarValue();
    if (info.operation == 'BETWEEN') {
      delete info.multiSelect;
    }
  }
  if (info.paramType == 'CALENDAR' || info.paramType == 'INPUT') {
    deleteListValue();
  }

  return info;
};

export default {
  newParamInformation,
  sanitizeParamInformation
};
