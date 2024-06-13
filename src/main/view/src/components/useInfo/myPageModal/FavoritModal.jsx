import Modal from 'components/common/atomic/Modal/organisms/Modal';
import DesignerReportTabs
  from 'components/common/atomic/ReportTab/organism/DesignerReportTabs';
import {setIconReportList} from 'components/report/util/ReportUtility';
import {getTheme} from 'config/theme';
import {SelectBox} from 'devextreme-react';
import models from 'models';
import React, {useEffect, useState} from 'react';
import {defaultItemList} from '../organism/MyPageUtility';
import useModal from 'hooks/useModal';

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
    props.id == 'defaultReportId' &&
      models.Report.getList('admin', null, 'designer').then(({data}) => {
        setIconReportList(data.privateReport);
        setIconReportList(data.publicReport);
        setReportList(data);
      });

    // props.id == 'defaultDatasetId' &&
    //   // 기본 데이터 집합 가져오기.
    //   models.Report.getList('admin', null, 'designer').then(({data}) => {
    //   });
  }, []);

  return (
    <Modal
      modalTitle={props.title}
      height={theme.size.middleModalHeight}
      width={theme.size.smallModalWidth}
      onSubmit={() => {
        if (value.type && value.type == 'FOLDER') {
          alert('보고서를 선택해 주세요.');
          return;
        }

        onSubmit(value);
      }}
      {...props}
    >
      {props.id == 'defaultDatasetId' &&
        <div>기본 데이터셋</div>
      }

      {props.id == 'defaultReportId' &&
        <DesignerReportTabs
          reportList={reportList}
          // onClose={}
          onSelectionChanged={(e) => {
            const param = e.component.getSelectedNodes()[0];

            const val = {
              type: param.itemData.type,
              id: param.key,
              name: param.text
            };

            setValue(val);
          }}
          onSubmit={onSubmit}
        />}

      {props.id == 'defaultItem' &&
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
        props.id == 'defaultPalette' &&
        <>
          <div>기본 색상</div>
          <SelectBox
            items={['Matarial', 'Office']}
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
