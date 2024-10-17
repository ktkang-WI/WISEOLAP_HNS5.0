import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {AuthorityContext, path, mode, getKeys, getUserOrGroup,
  getDataObjectOfUserOrGroup} from
  'components/config/organisms/authority/Authority';
import Form, {GroupItem, Item, Label} from 'devextreme-react/form';
import {useContext, useEffect, useState} from 'react';

const ProgList = ({mainKey, dependency}) => {
  // context
  const getContext = useContext(AuthorityContext);
  const [currentTab] = getContext.state.currentTab;
  if (currentTab !== mainKey) return <></>;
  const [dataSource, setDataSource] = useState(getContext.state.progList || []);
  const selected = getContext.state.selected;
  const data = getContext.state.data;
  const progMode =
    currentTab === path.GROUP_APP ? mode.GROUP : mode.USER;

  const formItemsData = {
    snbManagement: [
      {dataField: 'dashboard', label: '대시보드'},
      {dataField: 'adhoc', label: '비정형보고서'},
      {dataField: 'spreadSheet', label: '스프레드 시트'},
      {dataField: 'settings', label: '환경설정'}
    ],
    reportManagement: [
      {dataField: 'reportQueryPeriod', label: '보고서 조회 기간 설정'},
      {dataField: 'viewQuery', label: '쿼리 보기'},
      {dataField: 'reportConfiguration', label: '보고서 형상 관리'}
    ],
    datasetManagement: [
      {dataField: 'cube', label: '주제영역'},
      {dataField: 'dsSql', label: '쿼리 직접 입력'},
      {dataField: 'dsSingle', label: '단일 테이블'},
      {dataField: 'dsUpload', label: '사용자 업로드'}
    ]
  };

  const formItemGroup = (caption, items) => (
    <GroupItem cssClass='dx-field-group-wrapper' colCount={1} caption={caption}>
      {items.map((item, index) => (
        <Item
          key={index}
          editorType='dxCheckBox'
          dataField={item.dataField}
          editorOptions={{
            readOnly: false,
            onValueChanged: (e) => {
              if (!data?.next) return;
              const progMode =
                currentTab === path.GROUP_APP ? mode.GROUP : mode.USER;
              const {nextId} = getKeys(progMode, selected);
              data.next.map((d) => {
                if (nextId === (d.grpId || d.userNo)) {
                  d.prog = dataSource;
                }
                return d;
              });
            }
          }}
        >
          <Label text={item.label} alignment='start' />
        </Item>
      ))}
    </GroupItem>
  );

  const initDataSource = () => {
    const tempDataSource = _.cloneDeep(dataSource);
    for (const key in tempDataSource) {
      if (tempDataSource.hasOwnProperty(key)) {
        tempDataSource[key] = false;
      }
    }
    setDataSource(tempDataSource);
  };

  useEffect(() => {
    const updateData = () => {
      const {nextId} = getKeys(progMode, selected);
      if (!nextId) return;
      const prog = getUserOrGroup(progMode, data, nextId);
      if (!prog) {
        initDataSource();
        data.next.push({
          ...getDataObjectOfUserOrGroup(progMode, nextId),
          prog: dataSource
        });
        return;
      }
      setDataSource(prog.prog);
    };
    updateData();
  }, [dependency]);

  return (
    <Wrapper
      padding='10px 0px 0px 20px'
      overflow={'auto'}
      className='custom-scrollbar'
    >
      <Form
        formData={dataSource}
        showColonAfterLabel={true}
        colCount={2}>
        {formItemGroup('SNB 관리', formItemsData.snbManagement)}
        {formItemGroup('보고서 관리', formItemsData.reportManagement)}
        {formItemGroup('데이터 집합 관리', formItemsData.datasetManagement)}
      </Form>
    </Wrapper>
  );
};

export default ProgList;
