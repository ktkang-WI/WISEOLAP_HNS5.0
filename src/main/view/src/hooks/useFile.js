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

  const uploadWorkbookData = async (file, fileName, reportId) => {
    const newParam = new Blob([JSON.stringify(file)],
        {type: 'application/json'});
    const formData = new FormData();

    formData.append('file', newParam);
    formData.append('fileName', reportId.toString());

    try {
      const response = await models.File.uploadWorkbookData(formData);
      // 응답을 Blob 형태로 변환
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // 다운로드할 파일 이름 지정
      document.body.appendChild(link);
      link.click(); // 다운로드 링크 클릭하여 파일 다운로드 시작
      link.remove(); // 링크 제거
    } catch (error) {
      console.error('다운로드를 할 수 없습니다.', error);
    }
  };

  return {
    uploadFile,
    deleteFile,
    importFile,
    uploadWorkbookData
  };
};

export default useFile;
