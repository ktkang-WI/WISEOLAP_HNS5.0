import ItemType from 'components/report/item/util/ItemType';
import {exportToFile, Type} from 'components/utils/DataExport';
import models from 'models';

export class ItemDownload {
  constructor({
    id,
    item,
    itemExports,
    report,
    reportId
  }) {
    this.imgDownloadExcept = [
      'card',
      'liquidFillGauge',
      'calendar',
      'rangeBar',
      'schedulerComponent',
      'waterFall',
      'comboBox',
      'scatterPlot',
      'ciclePacking',
      'zoomableIcicle',
      'sunburstChart',
      'radialTree',
      'collapsibleTree',
      'heatMap',
      'wordCloud',
      'arc',
      'chord',
      'timeline',
      'boxPlot',
      'funnelChart',
      'starChart'
    ];
    this.ignoreDownload = [
      'textBox',
      'treeView',
      'schedulerComponent',
      'comboBox',
      'listBox',
      'coordinateDot',
      'coordinateLine'
    ];
    this.itemExports = itemExports;
    this.report = report;
    this.reportId = reportId;
  }
  getImgDownloadExcept = () => {
    return this.imgDownloadExcept;
  };

  getIgnoreDownload = () => {
    return this.ignoreDownload;
  };

  renderDownloadButtons = (id, item, isImgDownloadable) => {
    return [Type.IMG, Type.CSV, Type.TXT, Type.XLSX].map((type) => {
      if (type == Type.IMG && isImgDownloadable) return <></>;
      return (
        <button
          key={type}
          onClick={() =>
            this.#exportFile(
                id,
                type,
                item.meta.name
            )
          }
        >
          {type.toLowerCase()}
        </button>
      );
    });
  };
  #exportFile = (e, type, name) => {
    const pickItem = this.#itemExportsPicker(e);
    if (!this.#exportExceptionHandle(pickItem)) {
      console.error('아이템 및 데이터가 그려지지 않았습니다.');
      return;
    };
    if (Type.CSV === type) {
      exportToFile(name, pickItem.data, Type.CSV);
    } else if (Type.TXT === type) {
      exportToFile(name, pickItem.data, Type.TXT);
    } else if (Type.XLSX === type) {
      exportToFile(name, pickItem.data, Type.XLSX);
    } else if (Type.IMG === type) {
      exportToFile(name, pickItem, Type.IMG);
    }

    models.Log.insertDownloadLog(
        this.reportId || '1001',
        this.report?.options?.reportNm || 'New Report',
        this.report?.options?.reportType,
        e,
        name
    );
  };

  #exportExceptionHandle = (pickItem) => {
    let isOk = false;
    if (!pickItem) {
      isOk = false;
      return isOk;
    }
    isOk = Object.values(ItemType).includes(pickItem.type);

    return isOk;
  };

  #itemExportsPicker = (id) => {
    return this.itemExports.find((item) => item.id == id);
  };
}

// 아이템 별 저장아이템
export const itemExportsObject = (id, itemRef, type, data) => {
  return {
    id: id,
    ref: itemRef,
    type: type,
    data: data
  };
};
