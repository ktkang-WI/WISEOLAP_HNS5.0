import initStateImg from 'assets/image/icon/button/init_state.png';
import totalImg from 'assets/image/icon/button/total.png';
import grandTotalImg from 'assets/image/icon/button/grand_total.png';
import layoutImg from 'assets/image/icon/button/layout.png';
import removeNullDataImg from 'assets/image/icon/button/remove_null_data.png';
import rowTotalPosImg from 'assets/image/icon/button/row_total_position.png';
import colTotalPosImg from 'assets/image/icon/button/column_total_position.png';
import colRowSwitchImg from 'assets/image/icon/button/col_row_switch.png';
import dataPositionImg from 'assets/image/icon/button/measurement_location.png';
import showGridImg from 'assets/image/icon/button/show_grid.png';
import filterImg from 'assets/image/icon/button/show_filter.png';
import paging from 'assets/image/icon/button/paging_setting.png';
import {useDispatch, useSelector} from 'react-redux';
import ItemSlice from 'redux/modules/ItemSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import {selectCurrentItem, selectCurrentItems, selectRootItem}
  from 'redux/selector/ItemSelector';
import localizedString from 'config/localization';
import {CheckBox, RadioGroup} from 'devextreme-react';
import ItemType from '../util/ItemType';
import CustomEventUtility from './CustomEventUtility';
import Utility from './Utility';
import itemOptionManager from '../ItemOptionManager';
import useModal from 'hooks/useModal';
import ShowDataModal
  from 'components/common/atomic/Modal/organisms/ShowDataModal';
import store from 'redux/modules';
import useQueryExecute from 'hooks/useQueryExecute';
import PagingOptionModal from './modal/organism/PagingOptionModal';
import {selectCurrentDatasets} from 'redux/selector/DatasetSelector';
import {selectRootParameter} from 'redux/selector/ParameterSelector';
import {getItemData} from 'models/report/Item';

const useCustomEvent = () => {
  const dispatch = useDispatch();
  const {openModal, alert} = useModal();
  const reportId = useSelector(selectCurrentReportId);
  const selectedItem = useSelector(selectCurrentItem);
  const items = useSelector(selectCurrentItems);
  const {generateParameter, generateAdHocParamter} = useQueryExecute();
  const {updateItem} = ItemSlice.actions;
  const {
    commonPopoverButtonElement,
    commonRibbonBtnElement
  } = itemOptionManager();
  let formItems = {};

  // Ribbon 영역 CustomEvent
  // Ribbon 렌더링에 사용되는 dataSource
  if (selectedItem && selectedItem.type == ItemType.PIVOT_GRID) {
    formItems = CustomEventUtility.getFormItems(selectedItem);
  }

  const getRadioPopover = (key, value) => {
    return <RadioGroup
      onValueChanged={(e) => {
        const item = ribbonEvent[key](e);

        dispatch(updateItem({reportId, item}));
      }}
      valueExpr={'id'}
      displayExpr={'text'}
      value={value}
      items={formItems[key]}/>;
  };

  const getCheckBoxPopover = (key) => {
    const onValueChanged = (id, e) => {
      const item = ribbonEvent[key](id, e);

      dispatch(updateItem({reportId, item}));
    };

    return <>
      {formItems[key].map((item) => (
        <CheckBox
          onValueChanged={(e) => {
            onValueChanged(item.id, e);
          }}
          key={item.id}
          value={item.value}
          text={item.text}
        />
      ))}
    </>;
  };

  const getInitStatePopover = () => {
    const rootItem = selectRootItem(store.getState());
    const dataField = selectedItem.meta.dataField ||
      rootItem.adHocOption.dataField;
    const customExpand = selectedItem.meta.customExpand || false;

    const generateCheckBox = (field, pos, i) => {
      return <CheckBox
        onValueChanged={(e) => {
          const dataFields = _.cloneDeep(dataField);
          dataFields[pos][i].expand = !dataFields[pos][i].expand;
          const item = setMeta(selectedItem, 'dataField', dataFields);
          dispatch(updateItem({reportId, item}));
        }}
        key={field.fieldId}
        value={field.expand || false}
        text={field.caption}
        visible={customExpand}
      />;
    };

    try {
      return <>
        {getCheckBoxPopover('initState')}
        <CheckBox
          onValueChanged={(e) => {
            const item = setMeta(selectedItem, 'customExpand', e.value);
            dispatch(updateItem({reportId, item}));
          }}
          style={{marginBottom: '10px'}}
          value={customExpand}
          text={'커스텀 확장'}
        />
        <br/>
        {(dataField?.row || []).slice(0, -1).map((field, i) =>
          generateCheckBox(field, 'row', i))}
        {(dataField?.column || []).slice(0, -1).map((field, i) =>
          generateCheckBox(field, 'column', i))}
      </>;
    } catch (e) {
      console.error(e);
    }
  };

  const getModal = (key, params, Component) => {
    return openModal(Component,
        {
          ...params,
          onSubmit: (returnedOptions) => {
            const item =
            ribbonEvent[key](returnedOptions);
            dispatch(updateItem({reportId, item}));
          }
        }
    );
  };

  // ribbon Element 객체
  const ribbonConfig = {
    'InitState': {
      ...commonPopoverButtonElement,
      'id': 'init_state',
      'label': localizedString.initState,
      'imgSrc': initStateImg,
      'renderContent': () => {
        return getInitStatePopover();
      }
    },
    'Total': {
      ...commonPopoverButtonElement,
      'id': 'total',
      'label': localizedString.total,
      'imgSrc': totalImg,
      'renderContent': () => {
        return getCheckBoxPopover('total');
      }
    },
    'GrandTotal': {
      ...commonPopoverButtonElement,
      'id': 'grand_total',
      'label': localizedString.grandTotal,
      'imgSrc': grandTotalImg,
      'renderContent': () => {
        return getCheckBoxPopover('grandTotal');
      }
    },
    'Layout': {
      ...commonPopoverButtonElement,
      'id': 'layout',
      'label': localizedString.layout,
      'imgSrc': layoutImg,
      'renderContent': () => {
        return getRadioPopover('layout', selectedItem.meta.layout);
      }
    },
    'AutoSize': {
      ...commonPopoverButtonElement,
      'id': 'autoSize',
      'label': localizedString.autoSize,
      'imgSrc': layoutImg,
      'renderContent': () => {
        return getCheckBoxPopover('autoSize');
      }
    },
    'RowTotalPosition': {
      ...commonPopoverButtonElement,
      'id': 'row_total_position',
      'label': localizedString.rowTotalPosition,
      'imgSrc': rowTotalPosImg,
      'renderContent': () => {
        return getRadioPopover('rowTotalPosition',
            selectedItem.meta.positionOption.row.position);
      }
    },
    'ColumnTotalPosition': {
      ...commonPopoverButtonElement,
      'id': 'column_total_position',
      'label': localizedString.columnTotalPosition,
      'imgSrc': colTotalPosImg,
      'renderContent': () => {
        return getRadioPopover('columnTotalPosition',
            selectedItem.meta.positionOption.column.position);
      }
    },
    'Paging': {
      ...commonRibbonBtnElement,
      'id': 'input_paging',
      'label': localizedString.paging,
      'imgSrc': paging,
      'onClick': () => {
        return getModal('paging',
            {options: selectedItem.meta.pagingOption}, PagingOptionModal);
      }
    },
    'DataPosition': {
      ...commonPopoverButtonElement,
      'id': 'data_position',
      'label': localizedString.dataPosition,
      'imgSrc': dataPositionImg,
      'renderContent': () => {
        return getRadioPopover('dataPosition',
            selectedItem.meta.positionOption.dataPosition);
      }
    },
    'RemoveNullData': {
      ...commonPopoverButtonElement,
      'id': 'remove_null_data',
      'label': localizedString.removeNullData,
      'imgSrc': removeNullDataImg,
      'renderContent': () => {
        return getCheckBoxPopover('removeNullData');
      }
    },
    'ShowFilter': {
      ...commonPopoverButtonElement,
      'id': 'show_filter',
      'label': localizedString.showFilter,
      'imgSrc': filterImg,
      'renderContent': () => {
        return getCheckBoxPopover('showFilter');
      }
    }
  };

  const setMeta = (item, key, value) => {
    return {
      ...item,
      meta: {
        ...item.meta,
        [key]: value
      }
    };
  };

  const editPositionOption = (id, key, value) => {
    let positionOption = selectedItem.meta.positionOption;
    let target = '';

    const tempId = id.toLowerCase();
    if (tempId.indexOf('row') >= 0) {
      target = 'row';
    } else if (tempId.indexOf('column') >= 0) {
      target = 'column';
    }

    if (target) {
      positionOption = {
        ...positionOption,
        [target]: {
          ...positionOption[target],
          [key]: value
        }
      };
    } else {
      positionOption = {
        ...positionOption,
        [key]: value
      };
    }

    return setMeta(selectedItem, 'positionOption', positionOption);
  };

  // Ribbon 영역에서 수정할 수 있는 항목에서
  // 값 변화가 탐지될 경우(onValueChanged) 이벤트
  const ribbonEvent = {
    'initState': (id, e) => {
      alert(localizedString.requireReloadMsg);
      return editPositionOption(id, 'expand', e.value);
    },
    'total': (id, e) => {
      return editPositionOption(id, 'totalVisible', e.value);
    },
    'grandTotal': (id, e) => {
      return editPositionOption(id, 'grandTotalVisible', e.value);
    },
    'layout': (e) => {
      return setMeta(selectedItem, 'layout', e.value);
    },
    'autoSize': (id, e) => {
      return setMeta(selectedItem, id, e.value);
    },
    'paging': (e) => {
      const item = setMeta(selectedItem, 'pagingOption', e.paging);
      const newItem = {
        ...item,
        mart: {
          ...item.mart,
          paging: {
            ...item.mart.paging,
            size: e.paging.pagination.pagingRange,
            page: e.paging.pagination.index
          }
        }
      };

      return newItem;
    },
    'columnTotalPosition': (e) => {
      return editPositionOption('columnTotalPosition', 'position', e.value);
    },
    'rowTotalPosition': (e) => {
      return editPositionOption('rowTotalPosition', 'position', e.value);
    },
    'dataPosition': (e) => {
      return editPositionOption('dataPosition', 'dataPosition', e.value);
    },
    'removeNullData': (id, e) => {
      return setMeta(selectedItem, id, e.value);
    },
    'showFilter': (id, e) => {
      return setMeta(selectedItem, id, e.value);
    }
  };

  // TabButton CustomEvent
  const tabButtonConfig = {
    'ColRowSwitch': {
      title: localizedString.colRowSwitch,
      onClick: async (id) => {
        const item = _.cloneDeep(items.find((i) => id == i.id));
        const rootItem = selectRootItem(store.getState());
        if (!item.mart.init) {
          alert('피벗그리드 조회 후 진행해 주세요.');
          return;
        }
        item.meta.colRowSwitch = !item.meta.colRowSwitch;

        const datasets = selectCurrentDatasets(store.getState());
        const parameters = selectRootParameter(store.getState());
        let param = {};
        if (item.meta.dataField) {
          param = await generateParameter(
              item, datasets, parameters, item.mart.filter);
          Utility.generateParameter(item, param);
        } else {
          param = await generateAdHocParamter(
              rootItem, datasets, parameters);

          Utility.generateParameter(item, param, rootItem);
        }

        Utility.generateItem(item, param, rootItem);

        dispatch(updateItem({reportId, item}));
      },
      icon: <img width={'20px'} src={colRowSwitchImg}></img>
    },
    'ShowGrid': {
      title: localizedString.showGrid,
      onClick: async (id) => {
        const item = items.find((i) => id == i.id);
        if (!item.mart.init) {
          alert('피벗그리드 조회 후 진행해 주세요.');
          return;
        }
        const columns = [];
        const rootItem = selectRootItem(store.getState());
        const field = item.meta.dataField || rootItem.adHocOption.dataField;

        columns.push(...field.column);
        columns.push(...field.row);
        columns.push(...field.measure.map((mea) => ({
          name: mea.summaryType + '_' + mea.name,
          caption: mea.caption,
          type: mea.type,
          format: mea.format
        })));

        // remoteOpertion일 경우에만 적용
        const datasets = selectCurrentDatasets(store.getState());
        const parameters = selectRootParameter(store.getState());
        const param = await generateParameter(
            item, datasets, parameters, item.mart.filter);
        Utility.generateParameter(item, param);
        param.sortInfo = undefined;
        param.itemType = 'grid';

        const res = await getItemData(param);

        if (res.status == 200) {
          // TODO: 피벗 matrix 적용시 재조회하는 방식으로 바꿔야 함.
          openModal(ShowDataModal, {
            modalTitle: localizedString.showGrid + ' - ' + item.meta.name,
            data: res.data.data,
            columns: columns
          });
        } else {
          alert('그리드 조회에 실패하였습니다.');
        }
      },
      icon: <img width={'17px'} src={showGridImg}></img>
    }
  };

  /**
   * Tab Header Button element를 리턴합니다.
   * @param {*} key tabButton key
   * @param {*} id item id
   * @return {JSONObject} button config
   */
  const getTabHeaderButton = (key, id) => {
    return (
      <button
        key={key}
        title={tabButtonConfig[key].title}
        onClick={() => tabButtonConfig[key].onClick(id)}
      >
        {tabButtonConfig[key].icon}
      </button>
    );
  };

  return {
    ribbonConfig,
    getTabHeaderButton
  };
};

export default useCustomEvent;
