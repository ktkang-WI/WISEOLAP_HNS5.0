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

  const uploadsjs = async (file, param) => {
    const newParam = new Blob([JSON.stringify(param)],
        {type: 'application/json'});
    const formData = new FormData();
    formData.append('file', file);
    formData.append('param', newParam);
    const res = await models.File.uploadsjs(formData);
    if (res.status != 200) {
      console.error('Download Error: ', res.data);
      return;
    }

    const contentDisposition = res.headers['content-disposition'];
    let newFileName = 'defaultFileName';
    if (contentDisposition) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(contentDisposition);
      if (matches != null && matches[1]) {
        newFileName = decodeURIComponent(matches[1].replace(/['"]/g, ''));
      }
    }
    const convertFile = {
      name: newFileName,
      blob: new Blob([res.data])
    };

    const url = window.URL.createObjectURL(convertFile.blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', convertFile.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return {
    uploadFile,
    deleteFile,
    importFile,
    uploadsjs
  };
};

export default useFile;
