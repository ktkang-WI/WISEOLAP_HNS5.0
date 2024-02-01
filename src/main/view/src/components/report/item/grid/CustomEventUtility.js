// import localizedString from 'config/localization';
/**
 * ribbon 버튼에서 사용되는 form 렌더링에 필요한 데이터 소스들을 일괄 리턴합니다.
 * @param {*} item 현재 focus된 아이템
 * @return {JSONArray} formItems
 */
const getFormItems = (item) => {
  const dataGridOption = item.meta.dataGridOption;
  return {
    'gridLine': [
      {
        id: 'row',
        text: '가로 줄 표시',
        value: dataGridOption.gridLine.row
      },
      {
        id: 'column',
        text: '세로 줄 표시',
        value: dataGridOption.gridLine.column
      },
      {
        id: 'stripes',
        text: '줄 무늬 행',
        value: dataGridOption.gridLine.stripes
      }
    ],
    'autoGridWidth': [
      {
        id: 'contentAutoTailored',
        text: '내용에 자동 맞춤',
        value: dataGridOption.autoGridWidth.contentAutoTailored
      },
      {
        id: 'manual',
        text: '수동',
        value: dataGridOption.autoGridWidth.manual
      }
    ],
    'cellMerging': [
      {
        id: 'on',
        text: dataGridOption.option.on
      },
      {
        id: 'off',
        text: dataGridOption.option.off
      }
    ],
    'columnHeader': [
      {
        id: 'on',
        text: dataGridOption.option.on
      },
      {
        id: 'off',
        text: dataGridOption.option.off
      }
    ],
    'autoWrap': [
      {
        id: 'on',
        text: dataGridOption.option.on
      },
      {
        id: 'off',
        text: dataGridOption.option.off
      }
    ]
  };
};

export default {
  getFormItems
};
