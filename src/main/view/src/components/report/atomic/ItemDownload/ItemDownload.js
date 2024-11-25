// eslint-disable-next-line max-len
import {ImgCheckBox} from 'components/common/atomic/DataColumnTab/molecules/DataColumnSeriesOptions/Common/ImgCheckBox';
import downloadDefaultElement from
  'components/common/atomic/Ribbon/popover/organism/DownloadDefaultElement';
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
      'pivot',
      'grid',
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
    const {data} = downloadDefaultElement();
    const itemName = item?.meta?.name;
    return (
      <div style={{
        width: '220px'
      }}>
        {
          data.map((item, index) => {
            const elements = item.checkboxs.filter((ch) =>
              ch.type === 'excelMergeXlsx' ||
              (ch.type === 'img' && !isImgDownloadable) ||
              ch.type === 'csv' ||
              ch.type === 'txt'
            ).map((ch) => ({...ch, 'visible': true}));
            return (
              <ImgCheckBox key={index}
                onValueChanged={(e) => {
                  let type = '';
                  if (e.target.id === 'img') {
                    type = Type.IMG;
                  } else if (e.target.id === 'excelMergeXlsx') {
                    type = Type.XLSX;
                  } else if (e.target.id === 'csv') {
                    type = Type.CSV;
                  } else if (e.target.id === 'txt') {
                    type = Type.TXT;
                  }
                  this.#exportFile(
                      id,
                      type,
                      itemName
                  );
                }}
                title={item.title}
                useChecked={false}
                checkboxs={elements}
              />
            );
          })
        }
      </div>
    );
    // <CommonButton
    //   key={type}
    //   type={'whiteRound'}
    //   width='100%'
    //   height='20px'
    //   onClick={() =>
    //     this.#exportFile(
    //         id,
    //         type,
    //         item.meta.name
    //     )
    //   }
    // >
    //   {type.toLowerCase()}
    // </CommonButton>
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
      exportToFile(name, pickItem.data, Type.XLSX, pickItem);
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
    if (!pickItem || pickItem.data.length == 0) {
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
