import _ from 'lodash';

const baseToFormatMapper = {
  'yyyy:': 'YEAR',
  'yyyyMM': 'MONTH',
  'yyyy-MM': 'MONTH',
  'yyyyMMdd': 'DAY',
  'yyyy-MM-dd': 'DAY'
};

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
    dataset: [], // 필터를 사용하는 데이터집합

    // CUBE or DS_SINGLE Only Use
    orgField: '', // 주제영역, 단일 테이블의 경우 조회를 위해 원본 데이터 항목 키값 저장
    uniqueName: name.substring(1),
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

const newCubeParamInformation = (name, dsId, dsType,
    order = 1, cubeColumnInfo) => {
  return {
    ...newParamInformation(name, dsId, dsType, order),
    // newParamInformation 오버라이딩
    caption: cubeColumnInfo.columnCaption,
    exceptionValue: cubeColumnInfo.physicalTableName + '.' +
       cubeColumnInfo.physicalColumnKey,
    uniqueName: cubeColumnInfo.logicalColumnName,
    dataSource: cubeColumnInfo.physicalTableName,
    itemCaption: cubeColumnInfo.physicalColumnName != '' ?
        cubeColumnInfo.physicalColumnName :
        cubeColumnInfo.physicalColumnKey, // 리스트에 보여줄 값
    itemKey: cubeColumnInfo.physicalColumnKey, // 조회할 때 실제로 쿼리에 들어가는 값
    sortBy: cubeColumnInfo.orderBy != 'Null' ?
        cubeColumnInfo.orderBy == 'Key Column' ?
        cubeColumnInfo.physicalColumnKey :
        cubeColumnInfo.physicalColumnName :
        cubeColumnInfo.physicalColumnKey, // 정렬 기준 항목
    multiSelect: true, // 다중 선택
    useSearch: cubeColumnInfo.noLoading == 2 ?
      true : false,
    paramType: cubeColumnInfo.noLoading == 1 ?
      'INPUT' : 'LIST'
  };
};

const newSingleTableParamInformation = (name, dsId, dsType,
    order = 1, sourceField) => {
  return {
    ...newParamInformation(name, dsId, dsType, order),
    // newParamInformation 오버라이딩
    caption: sourceField.COL_CAPTION,
    exceptionValue: 'A.' + sourceField.COL_CAPTION,
    uniqueName: sourceField.COL_CAPTION,
    dataSource: sourceField.TBL_NM,
    itemCaption: sourceField.COL_NM, // 리스트에 보여줄 값
    itemKey: sourceField.COL_NM, // 조회할 때 실제로 쿼리에 들어가는 값
    multiSelect: true // 다중 선택
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

/**
 * 입력한 쿼리에서 매개변수의 이름을 배열로 추출합니다.
 * @param {string} query
 * @return {Array} names를 담은 배열
 */
const getParameterNamesInQuery = (query) => {
  return _.uniq(query.match(/@[^()\s,]+/g));
};

const getCubeParameterNamesCube = (paramInfo, paramName) => {
  return paramInfo.map((info) => info.name).concat(paramName);
};

/**
 * 달력필터의 경우 exceptionValue를 현재 시점으로 추가.
 * @param {JSON} info parameterInformation
 * @return {JSON}
 */
const setCalendarExceptionValue = (info) => {
  const format = info.calendarKeyFormat;
  const date = getCalendarNowDefaultValue(baseToFormatMapper[format], 0);

  return {
    ...info,
    exceptionValue: parseStringFromDate(date, format)
  };
};

/**
 * 문자열로 된 날짜를 Date로 바꿔 반환합니다.
 * @param {string} str 날짜 문자열
 * @param {string} format 포맷
 * @return {Date}
 */
const parseDateFromString = (str, format) => {
  switch (format) {
    case 'yyyy':
    case 'yyyy-MM':
    case 'yyyy-MM-dd':
      return new Date(str);
    case 'yyyy':
    case 'yyyyMM':
    case 'yyyyMMdd':
      const year = str.substring(0, 4);
      const month = str.length > 4 ? str.substring(4, 6) : '';
      const day = str.length > 6 ? str.substring(6, 8) : '1';

      return new Date(year, Number(month) - 1, day);
  }
};

/**
 * Date 객체를 문자열로 바꿔 반환합니다.
 * @param {Date} date 날짜
 * @param {string} format 포맷
 * @return {string}
 */
const parseStringFromDate = (date, format) => {
  let str = format;

  str = str.replace('yyyy', date.getFullYear());
  str = str.replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'));
  str = str.replace('dd', date.getDate().toString().padStart(2, '0'));

  return str;
};

const filterToParameter = (values, columnInfo, dsId) => {
  const name = '@WISE_F_' + columnInfo.physicalTableName +
      '_' + columnInfo.physicalColumnKey;

  return {
    name: name,
    values: values,
    caption: columnInfo.physicalColumnName,
    exceptionValue: columnInfo.physicalTableName + '.' +
        columnInfo.physicalColumnKey,
    uniqueName: columnInfo.logicalColumnName,
    dataType: 'STRING',
    operation: 'IN',
    dsType: 'CUBE',
    dsId: dsId,
    paramType: 'LIST'
  };
};

/**
 * 쿼리 실행에 필요한 Request Body 생성
 * @param {parameters} parameters 매개변수 목록
 * @param {getColumnCheck} getColumnCheck 쿼리 검증시 쓰레기값 입력
 * @return {string} parameter
 */
const generateParameterForQueryExecute = (parameters, getColumnCheck) => {
  const parameter = parameters.informations.map((p) => {
    let values = [];

    if (parameters.values[p.name]) {
      values = parameters.values[p.name].value;
    } else {
      // values = p.defaultValue;
      values = [];
    }

    if (values.length == 0 &&
      p.paramType == 'CALENDAR' && p.calendarDefaultType == 'NOW') {
      p.calendarPeriodBase.map((base, i) => {
        const value = p.calendarPeriodValue ? p.calendarPeriodValue[i] : 0;
        const date = getCalendarNowDefaultValue(base, value);
        values.push(
            parseStringFromDate(date, p.calendarKeyFormat)
        );
      });
    } else if (values.length == 0 && !p.defaultValueUseSql &&
      p.paramType == 'CALENDAR' && p.calendarDefaultType == 'QUERY') {
      p.defaultValue.map((value) => {
        if (!_.isEmpty(value)) {
          values.push(value);
        }
      });
    } else {
      if (getColumnCheck) {
        if (p.paramType == 'CALENDAR') {
          values = [];
        } else {
          values = ['-', '-'];
        }
      }
    }

    return {
      name: p.name,
      values: values,
      exceptionValue: p.exceptionValue,
      dataType: p.dataType,
      operation: p.operation,
      dsType: p.dsType,
      dsId: p.dsId,
      uniqueName: p.uniqueName,
      caption: p.cpation,
      paramType: p.paramType,
      format: p.calendarKeyFormat || ''
    };
  });

  return parameter;
};

/**
 * 달력 매개변수 현재 기준 기본값 계산
 * @param {*} base 기본값 기준
 * @param {*} value 이동값
 * @return {Date} 계산값
 */
const getCalendarNowDefaultValue = (base, value) => {
  let date = new Date();
  if (base == 'YEAR') {
    const year = date.getFullYear() + Number(value);
    date = new Date(year, date.getMonth(), date.getDate());
  }
  if (base == 'MONTH') {
    const month = date.getMonth() + Number(value);
    date = new Date(date.getFullYear(), month, date.getDate());
  }
  if (base == 'DAY') {
    const day = date.getDate() + Number(value);
    date = new Date(date.getFullYear(), date.getMonth(), day);
  }

  return date;
};

const checkKeyWordCalendar = (param) => {
  const makeCalendarKeyWord = [
    'BTD', 'BTM', 'BTY'
  ];

  if (param?.caption?.indexOf('기준일자') >= 0 ||
    param?.caption?.indexOf('기준 일자') >= 0) return 'BTD';

  const check =
    makeCalendarKeyWord.findIndex((key) => param?.caption?.indexOf(key) >= 0);

  return makeCalendarKeyWord[check];
};

export default {
  baseToFormatMapper,
  newParamInformation,
  sanitizeParamInformation,
  getParameterNamesInQuery,
  parseDateFromString,
  parseStringFromDate,
  generateParameterForQueryExecute,
  getCalendarNowDefaultValue,
  newCubeParamInformation,
  getCubeParameterNamesCube,
  filterToParameter,
  newSingleTableParamInformation,
  setCalendarExceptionValue,
  checkKeyWordCalendar
};
