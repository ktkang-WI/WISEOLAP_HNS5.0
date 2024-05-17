import models from 'models';
import useModal from './useModal';
import localizedString from 'config/localization';

const useFile = () => {
  const {alert} = useModal();
  /**
   * @param {Blob} file
   * @param {Object} param
   */
  const uploadFile = async (file, param) => {
    const newParam = new Blob([JSON.stringify(param)],
        {type: 'application/json'});
    const formData = new FormData();
    formData.append('file', file);
    formData.append('param', newParam);
    const response = await models.File.uploadFile(formData);
    if (response.status !== 200) {
      alert(localizedString.failToUpload);
    }
  };

  const deleteFile = async (param) => {
    const response = await models.File.deleteFile(param);
    if (response.status !== 200) {
      alert(localizedString.failToDelete);
    }
    return response;
  };

  const importFile = async (param) => {
    const response = await models.File.importFile(param);
    if (response.status !== 200) {
      alert(localizedString.noneExcelFile);
    }
    return response;
  };

  return {
    uploadFile,
    deleteFile,
    importFile
  };
};

export default useFile;
