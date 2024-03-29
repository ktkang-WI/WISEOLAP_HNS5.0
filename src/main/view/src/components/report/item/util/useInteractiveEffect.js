import useQueryExecute from 'hooks/useQueryExecute';
import {useEffect, useState} from 'react';

export const useInteractiveEffect =
({
  item,
  meta,
  selectionFunc = () => {},
  removeSelectionFunc = () => {},
  dependency = false
}) => {
  // 마스터 필터 걸린값 데이터 들
  const [selectedData, setSelectedData] = useState([]);
  const [event, setEvent] = useState([]);
  const [reload, setReload] = useState(0);
  const [, setSelectedItem] = useState([]);
  const interactiveOption = dependency ?
    {} : meta.interactiveOption;
  const {filterItems, clearAllFilter} = useQueryExecute();

  useEffect(() => {
    if (!interactiveOption.enabled) return;
    if (event.length === 0) return;
    selectionFunc(event);
    return () => {
      removeSelectionFunc(event);
    };
  }, [event]);

  useEffect(() => {
    callBackFilteringFunc();
  }, [reload]);

  useEffect(() => {
    if (!dependency) {
      setSelectedItem([]);
      setSelectedData([]);
      setEvent([]);
    }
  }, [interactiveOption]);

  useEffect(() => {
    if (!dependency) {
      setSelectedItem([]);
      filterItems(item, {});
      setSelectedData([]);
      setEvent([]);
    }
  }, [
    interactiveOption.targetDimension,
    interactiveOption.mode,
    interactiveOption.enabled
  ]);

  useEffect(() => {
    if (!dependency) {
      clearAllFilter(item);
      setSelectedData([]);
      setEvent([]);
    }
  }, [
    interactiveOption.crossDataSource
  ]);

  const setDataMasterFilter = (data) => {
    if (!data) return;
    if (!interactiveOption.enabled) return;
    let selectedTempData = [];
    if (interactiveOption.mode == 'single') {
      selectedTempData.push(data);
      setSelectedData(selectedTempData);
    } else {
      selectedTempData = [...selectedData];
      const isIncluded = selectedTempData.includes(data);
      if (isIncluded) {
        selectedTempData = selectedTempData.filter((item) => item !== data);
      } else {
        selectedTempData.push(data);
      }
      setSelectedData(selectedTempData);
    }
  };

  const getFilter = () => {
    const targetDiemnsion = interactiveOption?.targetDimension;
    const refineData = {};
    if (!targetDiemnsion) throw Error('code check please!');
    if (targetDiemnsion == 'dimension') {
      // TODO: 개발필요 차원
      const dim = meta.dataField.dimension;
      refineData[dim[0].uniqueName] = selectedData;
    } else {
      //  TODO: 개발필요 그룹
      // const dimGrp = meta.dataField.dimensionGroup;
    }
    return refineData;
  };

  const masterFilterSetting = (e) => {
    const filter = selectedData.length === 0 ? {} : getFilter();
    filterItems(item, filter);
  };

  const callBackFilteringFunc = () => {
    if (!interactiveOption.enabled) return;
    masterFilterSetting();
  };

  const masterFilterReload = (e) => {
    const mode = interactiveOption.mode;
    let isOk = true;
    let tempEvent;
    if (mode == 'single') {
      tempEvent = [];
    } else {
      tempEvent = event.filter(
          (innerEvent) => innerEvent.data !== e.data);
      isOk = false;
    }
    if (tempEvent.length === event.length) tempEvent.push(e);
    if (tempEvent.length === 0 && isOk) tempEvent.push(e);
    setEvent(tempEvent);
    setReload((prev) => prev + 1);
  };

  return {
    masterFilterOption: {
      interactiveOption: interactiveOption
    },
    functions: {
      setDataMasterFilter,
      masterFilterReload
    },
    state: {
      selectedData: [
        selectedData,
        setSelectedData
      ],
      event: [
        event,
        setEvent
      ]
    }
  };
};

