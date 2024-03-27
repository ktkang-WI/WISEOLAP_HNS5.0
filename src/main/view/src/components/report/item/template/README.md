### 아이템 추가시 해당 폴더 복사 후 README.md 지워서 사용하세요
## 중요!!! 반드시 주석 지우고 사용하세요! 이해를 돕기 위해 주석이 과하게 달려 있습니다!!!

# 아이템 추가 시 변경 사항

0. 해당 폴더 복제 후 아이템 이름으로 변경

1. 타입 추가
  - ItemType.java 및 ItemType.js에 아이템 타입 추가

2. 데이터 가공부 생성
  - dataFieldType.js와 Utility.js(getDataFieldOptionChild, generateParameter)에 데이터 필드 타입 등록
  - ItemDataMaker를 인터페이스를 확장한 DataMaker 생성
  - ItemDataMakerFactory 에 해당 DataMaker 등록

3. 아이템 렌더링
  - ItemFactory에 해당 아이템 한글 이름 등록
  - 해당 폴더에 있는 Template.jsx 파일명 및 컴포넌트명 변경    ex) Template.jsx => BoxPlot.jsx
  - NormalChartDefaultElemnt 또는 CustomChartDefaultElement에서 아이템 추가 버튼 생성

4. 아이템 기능 생성
  - 마스터 필터: 미리 생성되어 있는 마스터 필터 전용 useEffect와
    const {filterItems, clearAllFilter} = useQueryExecute();
    위 메서드를 사용해 구현
    filterItems(필터 객체, 아이템 객체)

    필터 객체는 다음과 같음

    {필드 uniqueName: [필터값1, 필터값2 ...]}

    ex) {자동차명: ['k3', 'k5'], 생산회사이름: ['기아']}

  - 리본 아이템 추가
    1. Utility getRibbonItems에 추가할 기능의 키값(String) 지정
    2. 공용메서드(캡션 변경, 팔레트 등)를 제외한 기능 CustomEvent.js에서 ribbonConfig 생성하여 반환

  - 다운로드: 추후 가이드 추가

  이외사항은 각 Utility에 달려있는 주석 참조