import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import {TreeView} from 'devextreme-react';
import localizedString from 'config/localization';
import removeImg from 'assets/image/icon/button/remove_white.png';
import styled from 'styled-components';
import folderImg from 'assets/image/icon/report/folder_load.png';
import dashImg from 'assets/image/icon/report/dash.png';
import excelImg from 'assets/image/icon/report/excel_file.png';
import adhocImg from 'assets/image/icon/report/adhoc.png';
import {DesignerMode} from 'components/config/configType';
import React, {useCallback, useRef} from 'react';
import {getTheme} from 'config/theme';
import useModal from 'hooks/useModal';
import {deleteReport} from 'models/report/Report';
import {userFolderData} from 'routes/loader/LoaderConfig';

const theme = getTheme();

const StyledTreeView = styled(TreeView)`
  color: ${theme.color.primaryFont};
  font: ${theme.font.dataSource};
  padding: 20px;
  box-sizing: border-box;
  letter-spacing: -1px;
  .dx-treeview-toggle-item-visibility {
    color: ${theme.color.primaryFont};
  }

  .dx-treeview-item-content {
    transform: none !important;
  }

  .dx-scrollable-wrapper {
    border: 1px solid #D4D7DC;
    border-radius: 6px;
  }
`;

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

const MyPageReportList = ({data, setData, setTreeViewData, setPrevName}) => {
  const {alert, confirm, success} = useModal();
  const ref = useRef();
  let reportId = null;

  const handleItemClick = (e) => {
    if (e.itemData.type == 'FOLDER') {
      reportId = null;
      setPrevName(null);
      setData({});
    } else {
      // TODO : 추후 back단에서 처리 예정.
      const newData = e.itemData;
      if (e.itemData && typeof e.itemData.datasetXml === 'string') {
        newData.datasetXml = JSON.parse(e.itemData.datasetXml);
        if (newData.datasetXml.datasets.length > 0) {
          newData.datasets = newData.datasetXml.datasets;
          if (e.itemData.query) {
            newData.query = _.cloneDeep(JSON.parse(e.itemData.query));
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
      if (e.node?.parent?.text) {
        newData.fldParentNm = e.node?.parent?.text;
      }

      setPrevName(e.itemData.name);
      reportId = newData.id;
      setData({...newData});
    }
  };

  const onClickRemove = (e) => {
    const id = reportId;

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
  };

  const itemRender = useCallback((item) => {
    return (
      <div className="dx-item-content dx-treeview-item-content">
        <img width='16px' src={iconMapper[item.type]} className="dx-icon"/>
        <span>{item.name}</span>
      </div>
    );
  }, []);

  return (
    <>
      <StyledTreeView
        ref={ref}
        height='100%'
        width='100%'
        items={data}
        dataStructure="plain"
        displayExpr="name"
        selectionMode='single'
        parentIdExpr="fldParentId"
        keyExpr="id"
        noDataText={localizedString.noReports}
        searchEnabled={true}
        searchEditorOptions={{
          placeholder: localizedString.search,
          width: '300px'
        }}
        itemRender={itemRender}
        focusStateEnabled={true}
        onItemClick={handleItemClick}
      />
      <div style={{
        display: 'flex',
        height: '50%',
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
