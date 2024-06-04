import InputTxtAndCheckBox
  from 'components/common/atomic/Modal/organisms/InputTxtAndCheckBox';
import SimpleInputModal
  from 'components/common/atomic/Modal/organisms/SimpleInputModal';
import useModal from 'hooks/useModal';
import {createMyPageFolder, deleteMyPageFolder, updateMyPageFolder}
  from 'models/config/reportFolderManagement/ReportFolderManagement';
import {userFolderData} from 'routes/loader/LoaderConfig';

const ReportFolderUtility = () => {
  const {alert, confirm, openModal} = useModal();

  const afterCrudLoadData = (setTreeViewData) => {
    // 변경 사항 적용 위해 통신하여 데이터 불러옴
    userFolderData().then((respose) => {
      setTreeViewData(respose);
    }).catch(() => {
      alert('에러 발생. 관리자에게 문의 하세요.');
    });
  };

  const checkValidation = {
    nameDuple: (value, treeViewData) => {
      const check = treeViewData.findIndex((data) => value == data.name);
      if (check > -1) alert('이름이 중복 되었습니다. 다시 작성해 주세요.');
      return check > -1 ? false : true;
    },
    emptyName: (value) => {
      if (value == '') alert('이름을 작성해 주세요.');
      return value == '' ? false : true;
    },
    noSelection: (itemData) => {
      if (!Object.keys(itemData).length) alert('아무것도 선택되지 않았습니다.');
      return !Object.keys(itemData).length ? false : true;
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
    confirm('폴더를 생성 하시겠습니까?', () => {
      openModal(InputTxtAndCheckBox, {
        modalTitle: '폴더 생성',
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
    confirm('삭제 하시겠습니까?', () => {
      const flds = treeViewData.folder.filter((fld) => fld.id == itemData.id);

      getRecursiveUserFolderId(treeViewData, itemData, flds);

      const deleteFldIds = flds.map((f) => f.id);

      deleteMyPageFolder(deleteFldIds).then((response) => {
        itemData = {};
        afterCrudLoadData(setTreeViewData);
      }).catch();
    });
  };

  const updateUserFolderUtil = (itemData, treeViewData, setTreeViewData) => {
    confirm('폴더 이름을 변경 하시겠습니까?', () => {
      openModal(SimpleInputModal, {
        modalTitle: '폴더 이름 변경',
        defaultValue: itemData.name,
        onSubmit: (value) => {
          let isOk= checkValidation.emptyName(value);
          isOk = checkValidation.nameDuple(value, treeViewData);

          if (!isOk) return false;

          updateMyPageFolder(itemData.id, value).then((respose) => {
            if (respose.status == 200) {
              itemData = {};
              // 변경 사항 적용 위해 통신하여 데이터 불러옴
              afterCrudLoadData(setTreeViewData);
            }
          }).catch();
        }
      });
    });
  };
  return {
    newUserFolderUtil,
    deleteUserFolderUtil,
    updateUserFolderUtil,
    checkValidation
  };
};
export default ReportFolderUtility;
