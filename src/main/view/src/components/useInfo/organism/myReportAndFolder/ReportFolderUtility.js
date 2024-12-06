import InputTxtAndCheckBox
  from 'components/common/atomic/Modal/organisms/InputTxtAndCheckBox';
import useModal from 'hooks/useModal';
import {createMyPageFolder, deleteMyPageFolder,
  updateMyPageFolder, updateMyPageFolderOrder, updateMyPageReportOrder,
  reorderFolders}
  from 'models/config/reportFolderManagement/ReportFolderManagement';
import {userFolderData} from 'routes/loader/LoaderConfig';
import localizedString from 'config/localization';

const ReportFolderUtility = () => {
  const {alert, confirm, openModal, success} = useModal();

  const afterCrudLoadData = (setTreeViewData) => {
    // 변경 사항 적용 위해 통신하여 데이터 불러옴
    userFolderData().then((respose) => {
      setTreeViewData(respose);
    }).catch(() => {
      alert(localizedString['axiosReport&folderError']);
    });
  };

  // 유효성 모음.
  const checkValidation = {
    nameDuple: (value, treeViewData) => {
      const check = treeViewData.findIndex((data) => value == data.name);
      if (check > -1) alert(localizedString.nameDupleAlert);
      return check > -1 ? false : true;
    },
    emptyName: (value) => {
      if (value == '') alert(localizedString.emptyNameAlert);
      return value == '' ? false : true;
    },
    noSelection: (itemData) => {
      if (!Object.keys(itemData).length) {
        alert(localizedString.noSelectionAlert);
      }
      return !Object.keys(itemData).length ? false : true;
    },
    noSelectedFolderInfo: () => {
      alert(localizedString.noSelectionFolderAlert);
    }
  };

  const createParam = (value, check, itemData) => {
    // check true (최상위 폴더 생성.)
    const emptyCheck = Object.keys(itemData).length;

    return {
      name: value,
      fldLvl: (check || !emptyCheck) ? 0 : itemData.fldLvl + 1,
      fldParentId: (check || !emptyCheck) ? 0 : itemData.id,
      ordinal: 0,
      desc: itemData.desc || ''
    };
  };

  const newUserFolderUtil = (itemData, treeViewData, setTreeViewData) => {
    confirm(localizedString.createFolderConfirm, () => {
      openModal(InputTxtAndCheckBox, {
        modalTitle: localizedString.createFolder,
        onSubmit: (value, check) => {
          let isOk= checkValidation.emptyName(value);
          isOk = checkValidation.nameDuple(value, treeViewData);

          if (!isOk) return false;

          const param = createParam(value, check, itemData);

          createMyPageFolder(param).then(() => {
            itemData = {};
            // 변경 사항 적용 위해 통신하여 데이터 불러옴
            afterCrudLoadData(setTreeViewData);
          }).catch();
        }
      });
    });
  };

  const getRecursiveUserFolderId = (folder, itemData, result) => {
    // 선택 폴더 및 바로 및 하위 폴더 검색.
    const flds = folder.filter((fld) =>
      itemData.id == fld.fldParentId
    );
    // break
    if (flds.length == 0) return;

    result.push(...flds);

    // 하위 폴더의 하위 폴더 검색. forEach : 하위 폴더가 여러개인 경우.
    flds.forEach((fld) => {
      return getRecursiveUserFolderId(folder, fld, result);
    });
  };

  const deleteUserFolderUtil = (itemData, treeViewData, setTreeViewData) => {
    confirm(localizedString.deleteConfirm, () => {
      const flds = treeViewData.filter((fld) => fld.id == itemData.id);

      getRecursiveUserFolderId(treeViewData, itemData, flds);

      const deleteFldIds = flds.map((f) => f.id);

      deleteMyPageFolder(deleteFldIds).then((response) => {
        itemData = {};
        afterCrudLoadData(setTreeViewData);
      }).catch();
    });
  };

  const updateUserFolderUtil = (itemData, setRow, setTreeViewData) => {
    confirm(localizedString.changeFolderNmConfirm, () => {
      updateMyPageFolder(itemData).then((respose) => {
        if (respose.status == 200) {
          success(localizedString.successSave);
          // 변경 사항 적용 위해 통신하여 데이터 불러옴
          afterCrudLoadData(setTreeViewData);
          setRow({});
        }
      }).catch();
    });
  };

  const updateUserFolderOrderUtil = (datasource, sourceData,
      setTreeViewData) => {
    const updatedList = datasource
        .filter((data) => data['fldParentId'] === sourceData['fldParentId'])
        .map((data, i) => ({...data, ordinal: i}));
    const updatedDatasource = datasource.map((data) =>
      updatedList.find((item) => item['id'] === data['id']) || data
    );

    updateMyPageFolderOrder(updatedList).then((response) => {
      if (response.status === 200) {
        setTreeViewData((prev) => ({
          ...prev,
          folder: updatedDatasource
        }));
      }
    });
  };

  const updatePublicFolderOrderUtil = (datasource, sourceData,
      setData) => {
    const updatedList = datasource
        .filter((data) => data['fldParentId'] === sourceData['fldParentId'])
        .map((data, i) => ({
          ...data,
          fldOrdinal: i
        }));
    const updatedDatasource = datasource.map((data) =>
      updatedList.find((item) => item['fldId'] === data['fldId']) || data
    );

    reorderFolders(updatedList).then((response) => {
      if (response.status === 200) {
        setData(updatedDatasource);
      }
    });
  };

  const updateUserReportOrderUtil = (datasource, sourceData,
      setTreeViewData) => {
    const updatedList = datasource
        .filter((data) => data['fldParentId'] === sourceData['fldParentId'])
        .filter((data) => data.type !== 'FOLDER')
        .map((data, i) => ({...data, ordinal: i}));
    const updatedDatasource = datasource.map((data) =>
      updatedList.find((item) => item['id'] === data['id']) || data
    );
    const newUpdatedList = updatedList.map((item) => {
      delete item.datasets;
      delete item.query;
      delete item.datasetXml;
      return item;
    });

    updateMyPageReportOrder(newUpdatedList).then((response) => {
      if (response.status === 200) {
        setTreeViewData((prev) => ({
          ...prev,
          folderReport: updatedDatasource
        }));
      }
    });
  };

  return {
    newUserFolderUtil,
    deleteUserFolderUtil,
    updateUserFolderUtil,
    checkValidation,
    updateUserFolderOrderUtil,
    updatePublicFolderOrderUtil,
    updateUserReportOrderUtil
  };
};
export default ReportFolderUtility;
