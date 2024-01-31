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
    try {
      const newParam = new Blob([JSON.stringify(param)],
          {type: 'application/json'});
      const formData = new FormData();
      formData.append('file', file);
      formData.append('param', newParam);
      await models.File.uploadFile(formData);
    } catch (error) {
      alert(localizedString.noneFile);
    }
  };

  const deleteFile = async (param) => {
    try {
      await models.File.deleteFile(param);
    } catch (error) {
      alert(localizedString.noneFile);
    }
  };

  const importFile = async (param) => {
    try {
      const response = await models.File.importFile(param);
      return response;
    } catch (error) {
      alert(localizedString.noneFile);
    }
  };

  return {
    uploadFile,
    deleteFile,
    importFile
  };
};

export default useFile;
