import Modal from 'components/common/atomic/Modal/organisms/Modal';
import DesignerReportTabs
  from 'components/common/atomic/ReportTab/organism/DesignerReportTabs';
import {setIconReportList} from 'components/report/util/ReportUtility';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import {SelectBox} from 'devextreme-react';
import models from 'models';
import React, {useEffect, useState} from 'react';
import useModal from 'hooks/useModal';
import {
  MyDesignerConstance,
  defaultItemList,
  favoritIdMapper
} from '../organism/myDesigner/MypageDesignerUtil';
import {paletteCollection}
  from 'components/common/atomic/Popover/organism/Palette';

const theme = getTheme();

const getSelectBoxValue = (id, data) => {
  if (id == 'defaultItem') {
    return data.defaultItem;
  } else if (id == 'defaultPalette') {
    return data.defaultPalette;
  } else {
    return null;
  }
};

const FavoritModal = ({onSubmit, data, ...props}) => {
  const selectBoxValue = getSelectBoxValue(props.id, data);
  const [value, setValue] = useState(selectBoxValue);
  const [reportList, setReportList] = useState();
  const {alert} = useModal();
  let report = value;

  useEffect(() => {
    switch (props.id) {
      case MyDesignerConstance['DEFAULT_REPORT_ID']:
      case MyDesignerConstance['ADHOC_DEFAULT_REPORT_ID']:
      case MyDesignerConstance['EXCEL_DEFAULT_REPORT_ID']:
      case MyDesignerConstance['DEFAULT_VIEWER_REPORT_ID']:
        models.Report.getList(favoritIdMapper[props.id], 'designer').then(
            ({data}) => {
              setIconReportList(data.privateReport);
              setIconReportList(data.publicReport);
              setReportList(data);
            }
        );
      default: break;
    }
    // TODO: 요청 있을 시 기본 데이터집합 추가 예정.
  }, []);
  const getProperties = () => {
    const property = {name: '기본 색상', items: paletteCollection};

    if (props.id == MyDesignerConstance['DEFAULT_ITEM']) {
      property.name = '기본 아이템';
      property.items = defaultItemList();
    }

    return property;
  };

  const selectModalContents = () => {
    switch (props.id) {
      case MyDesignerConstance['DEFAULT_REPORT_ID']:
      case MyDesignerConstance['ADHOC_DEFAULT_REPORT_ID']:
      case MyDesignerConstance['EXCEL_DEFAULT_REPORT_ID']:
      case MyDesignerConstance['DEFAULT_VIEWER_REPORT_ID']:
        return (
          <DesignerReportTabs reportList={reportList}
            onClose={() => props.onClose()}
            onSelectionChanged={(e) => {
              const param = e.component.getSelectedNodes()[0];

              if (!param) return;

              report = makeParameter(param);
            }}
            onSubmit={onSubmit}/>
        );
      case MyDesignerConstance['DEFAULT_PALETTE']:
      case MyDesignerConstance['DEFAULT_ITEM']:
        const selectBoxProperties = getProperties();

        return (
          <>
            <div>{selectBoxProperties.title}</div>
            <SelectBox
              items={selectBoxProperties.items}
              valueExpr='name'
              displayExpr='caption'
              value={value}
              onValueChanged={(e) => {
                setValue(e.value);
              }}
            />
          </>
        );
      default:
        break;
    }
  };

  const makeParameter = (param) => {
    const value = {
      type: param.itemData.type,
      id: param.key,
      name: param.text,
      reportType: param.itemData.reportType
    };

    return value;
  };

  return (
    <Modal
      modalTitle={props.title}
      height={theme.size.middleModalHeight}
      width={theme.size.smallModalWidth}
      onSubmit={() => {
        if (!report) return;

        if (report.type == 'FOLDER') {
          alert(localizedString.selectReportAlert);
          return;
        }

        onSubmit(report);
      }}
      {...props}
    >
      {/* {props.id == 'defaultDatasetId' &&
        <div>기본 데이터셋</div>
      } */}

      {selectModalContents()}
    </Modal>
  );
};
export default React.memo(FavoritModal);
