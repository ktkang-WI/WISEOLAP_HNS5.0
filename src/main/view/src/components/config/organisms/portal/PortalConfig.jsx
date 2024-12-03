import AddRibbonBtn from 'components/common/atomic/Ribbon/atom/AddRibbonBtn';
import ConfigHeader from 'components/config/atoms/common/ConfigHeader';
import saveReport from 'assets/image/icon/button/save.png';
import localizedString from 'config/localization';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {getTheme} from 'config/theme';
import Group from 'components/config/molecules/common/Group';
import PortalTypeGrid from 'components/config/molecules/portal/PortalTypeGrid';
import {useEffect, useRef, useState} from 'react';
import models from 'models';
import PortalReportGrid
  from 'components/config/molecules/portal/PortalReportGrid';
import PortalCardGrid from 'components/config/molecules/portal/PortalCardGrid';
import {Form} from 'devextreme-react';
import {Item} from 'devextreme-react/form';

const theme = getTheme();

const PortalConfig = () => {
  const height = 'calc(100% - 70px)';
  const [types, setTypes] = useState([]);
  const [reports, setReports] = useState([]);
  const [cards, setCards] = useState([]);
  const [teams, setTeams] = useState([]);
  const [dsSource, setDsSource] = useState([]);

  const typeRef = useRef();
  const reportRef = useRef();
  const queryRef = useRef();
  const teamRef = useRef();

  useEffect(() => {
    models.DataSource.getDs().then((res) => {
      if (res.status == 200) {
        setDsSource(res.data.data);
      }
    });

    models.Portal.getPortalConfig().then((data) => {
      if (data.status == 200) {
        const {types, reports, cards, teams} = data.data;
        setTypes(types);
        setReports(reports);
        setCards(cards);
        setTeams(teams[0]);
      }
    });
  }, []);

  const savePortalConfig = () => {
    if (typeRef.current && reportRef.current && queryRef.current) {
      const param = {};

      param.types =
        typeRef.current.instance?.getDataSource().items();
      param.reports =
        reportRef.current.instance?.getDataSource().items();
      param.cards =
        queryRef.current.instance?.getDataSource().items();
      param.teams = [teamRef.current.instance?.option('formData')];

      models.Portal.setPortalConfig(JSON.stringify(param)).then((res) => {
        if (res.status == 200) {
          alert(localizedString.successSave);
        }
      });
    }
  };

  return (
    <Wrapper display='flex' direction='column'>
      <ConfigHeader style={{padding: '12px'}}>
        <AddRibbonBtn
          item={{
            'label': localizedString.save,
            'onClick': savePortalConfig,
            'imgSrc': saveReport
          }}
        />
      </ConfigHeader>
      <Wrapper
        display='flex'
        height={height}
        direction='column'
        style={{
          overflow: 'auto',
          borderRadius: '10px',
          border: 'solid 1px ' + theme.color.breakLine,
          background: theme.color.panelColor,
          maxHeight: height,
          minHeight: height,
          marginTop: '10px',
          padding: '40px'
        }}
      >
        <Group title='메인화면 필터 관리'>
          <PortalTypeGrid
            dataSource={types}
            dxRef={typeRef}
          />
        </Group>
        <Group title='메인화면 보고서 관리'>
          <PortalReportGrid
            dataSource={reports}
            dxRef={reportRef}
          />
        </Group>
        <Group title='메인화면 카드 쿼리 관리'>
          <PortalCardGrid
            dataSource={cards}
            dxRef={queryRef}
            dsSource={dsSource}
          />
          <br/>
          <p>※ 구분, 색상, 금액, 전년비(또는 전월비), 계획비로 이루어진 데이터 반환</p>
          <p>※ 색상은 데이터가 없을 경우 기본 색상으로 렌더링 됩니다.</p>
          <p>※ 계획비는 데이터가 없을 경우 렌더링되지 않습니다.</p>
          <p>※ @DATE, @MDTEAM 으로 필터에 선택된 날짜와 팀을 매핑할 수 있습니다.</p>
        </Group>
        <Group title='팀 쿼리 관리'>
          <Form
            labelMode='outside'
            labelLocation='left'
            ref={teamRef}
            formData={teams}
            width={'100%'}
            style={{maxWidth: '700px'}}
          >
            <Item
              dataField='dsId'
              label={{
                'text': '데이터 원본'
              }}
              editorType='dxSelectBox'
              editorOptions={{
                dataSource: dsSource,
                displayExpr: 'dsNm',
                valueExpr: 'dsId'
              }}
            />
            <Item
              dataField='query'
              name='쿼리'
              label={{
                'text': '쿼리'
              }}
              editorType='dxTextArea'
              editorOptions={{
                height: '230px',
                valueChangeEvent: 'keyup'
              }}
            />
          </Form>
          <p>※ MD_TEAM_NM 컬럼을 가진 데이터 반환</p>
        </Group>
      </Wrapper>
    </Wrapper>
  );
};

export default PortalConfig;
