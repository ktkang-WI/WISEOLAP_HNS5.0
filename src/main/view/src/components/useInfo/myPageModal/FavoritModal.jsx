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
  defaultItemList
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

  useEffect(() => {
    (props.id == MyDesignerConstance['DEFAULT_REPORT_ID'] ||
      props.id == MyDesignerConstance['DEFAULT_VIEWER_REPORT_ID']) &&
      models.Report.getList(null, 'designer').then(({data}) => {
        setIconReportList(data.privateReport);
        setIconReportList(data.publicReport);
        setReportList(data);
      });

    // props.id == 'defaultDatasetId' &&
    //   // 기본 데이터 집합 가져오기.
    //   models.Report.getList('admin', null, 'designer').then(({data}) => {
    //   });
  }, []);

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
        if (value?.type && value?.type == 'FOLDER') {
          alert(localizedString.selectReportAlert);
          return;
        }

        onSubmit(value);
      }}
      {...props}
    >
      {/* TODO : 추후 코드 변경 작업 예정. */}

      {/* {props.id == 'defaultDatasetId' &&
        <div>기본 데이터셋</div>
      } */}

      {(props.id == MyDesignerConstance['DEFAULT_REPORT_ID'] ||
      props.id == MyDesignerConstance['DEFAULT_VIEWER_REPORT_ID']) &&
        <DesignerReportTabs
          reportList={reportList}
          onSelectionChanged={(e) => {
            const param = e.component.getSelectedNodes()[0];

            if (!param) return;

            setValue(makeParameter(param));
          }}
          onSubmit={onSubmit}
        />}

      {props.id == MyDesignerConstance['DEFAULT_ITEM'] &&
        <>
          <div>기본 아이템</div>
          <SelectBox
            items={defaultItemList()}
            valueExpr='id'
            displayExpr='name'
            value={value}
            onValueChanged={(e) => {
              setValue(e.value);
            }}
          />
        </>
      }

      {
        props.id == MyDesignerConstance['DEFAULT_PALETTE'] &&
        <>
          <div>기본 색상</div>
          <SelectBox
            items={paletteCollection}
            valueExpr='name'
            displayExpr='caption'
            value={value}
            onValueChanged={(e) => {
              setValue(e.value);
            }}
          />
        </>
      }
    </Modal>
  );
};
export default React.memo(FavoritModal);
