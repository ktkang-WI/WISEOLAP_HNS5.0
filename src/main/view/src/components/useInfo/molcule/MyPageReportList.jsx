import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import localizedString from 'config/localization';
import removeImg from 'assets/image/icon/button/remove_white.png';
import folderImg from 'assets/image/icon/report/folder_load.png';
import dashImg from 'assets/image/icon/report/dash.png';
import excelImg from 'assets/image/icon/report/excel_file.png';
import adhocImg from 'assets/image/icon/report/adhoc.png';
import {DesignerMode} from 'components/config/configType';
import React, {useCallback, useState} from 'react';
import {getTheme} from 'config/theme';
import useModal from 'hooks/useModal';
import {deleteReport} from 'models/report/Report';
import {userFolderData} from 'routes/loader/LoaderConfig';
import StyledTreeList from
  'components/config/atoms/reportFolderManagement/StyledTreeList';
import {Column, RowDragging, SearchPanel, Selection}
  from 'devextreme-react/tree-list';
import {onDragChange, onReorder}
  from 'components/config/utility/utility';
const theme = getTheme();

const smallButton = {
  height: '30px',
  borderRadius: '4px',
  font: theme.font.smallButton
};

const iconMapper = {
  'FOLDER': folderImg,
  [DesignerMode.DASHBOARD]: dashImg,
  [DesignerMode.AD_HOC]: adhocImg,
  [DesignerMode.EXCEL]: excelImg
};

const MyPageReportList = ({data, setData, setTreeViewData, setPrevName,
  updateUserReportOrderUtil
}) => {
  const {alert, confirm, success} = useModal();
  const [reportId, setReportId] = useState(null);

  const handleItemClick = useCallback((e) => {
    const itemData = e.data;
    if (itemData.type == 'FOLDER') {
      setReportId(null);
      setPrevName(null);
      setData({});
    } else {
      // TODO : 추후 back단에서 처리 예정.
      const newData = itemData;
      if (itemData && typeof itemData.datasetXml === 'string') {
        newData.datasetXml = JSON.parse(itemData.datasetXml);
        if (newData.datasetXml.datasets.length > 0) {
          newData.datasets = newData.datasetXml.datasets;
          if (itemData.query) {
            newData.query = _.cloneDeep(JSON.parse(itemData.query));
            for (let i = 0; i < newData.datasets.length; i++) {
              if (newData.query[newData.datasets[i].datasetId]?.length > 0) {
                newData.datasets[i].selectBoxItems =
                  newData.query[newData.datasets[i].datasetId];
                newData.query[newData.datasets[i].datasetId].map(
                    (item) => {
                      newData.datasets[i][item] = newData.query[item];
                    });
              }
            }
          }
        }
      }
      if (e.node?.parent?.data?.name) {
        newData.fldParentNm = e.node?.parent?.data?.name;
      }

      setPrevName(itemData.name);
      setReportId(newData.id);
      setData({...newData});
    }
  }, [data, reportId]);

  const onClickRemove = useCallback((e) => {
    const id = _.cloneDeep(reportId);

    if (!id || id === '') {
      alert(localizedString.selectReportAndDeleteConfirm);
      return;
    }

    confirm(localizedString.reportDeleteConfirm, () => {
      deleteReport({reportId: id}).then((res) => {
        if (!res.status == 200) return alert(localizedString.failReportDelete);

        success(localizedString.successReportDelete);

        userFolderData().then((res) => {
          if (!res) return alert(localizedString.failReportDelete);

          setTreeViewData(res);
        }).catch((e) => {
          console.log(e);
        });

        setData({});
      }).catch((e) => {
        console.log(e);
      });
    });
  }, [reportId, data]);

  const handleReorder = useCallback((e) => {
    const updatedEvent = {
      ...e,
      datasource: _.cloneDeep(data),
      key: 'id',
      parentKey: 'fldParentId',
      typeKey: 'type'
    };
    const {datasource, sourceData} = onReorder(updatedEvent);

    if (!datasource) {
      return;
    }

    // const newDatasource = datasource.filter((data) => data.type != 'FOLDER');
    updateUserReportOrderUtil(datasource, sourceData, setTreeViewData);
    e.component.clearSelection();
  }, [reportId, data]);

  return (
    <>
      <StyledTreeList
        height='90%'
        width='100%'
        dataSource={data || []}
        keyExpr="id"
        parentIdExpr="fldParentId"
        showColumnHeaders={false}
        onRowClick={handleItemClick}
      >
        <SearchPanel
          visible={true}
          width={250}
        />
        <Selection mode="single" />
        <RowDragging
          onDragChange={(e) => onDragChange({...e, key: 'id'})}
          onReorder={handleReorder}
          allowDropInsideItem={true}
          allowReordering={true}
          showDragIcons={false}
        />
        <Column
          dataField="name"
          caption={localizedString.folderName}
          cellRender={({row}) => {
            return (
              <>
                <img
                  style={{marginTop: '1.5px', float: 'left'}}
                  src={iconMapper[row.data.type]}
                  height={'17px'}
                />
                <span style={{lineHeight: '17px', marginLeft: '5px'}}>
                  {row.data.name}
                </span>
              </>
            );
          }}
        />
      </StyledTreeList>
      <div style={{
        display: 'flex',
        height: '10%',
        padding: '10px 20px',
        justifyContent: 'right'
      }}>
        <CommonButton
          {...smallButton}
          width='70px'
          type='red'
          onClick={onClickRemove}
        >
          <img height='20px' src={removeImg}/>
          {localizedString.deleteReport}
        </CommonButton>
      </div>
    </>
  );
};

export default React.memo(MyPageReportList);
