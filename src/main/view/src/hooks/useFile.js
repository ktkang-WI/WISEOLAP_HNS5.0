import models from 'models';

const useFile = () => {
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

      const response = await models.File.uploadFile(formData);

      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const deleteFile = async (param) => {
    try {
      const response = await models.File.deleteFile(param);
      console.log('File delete successfully:', response.data);
    } catch (error) {
      console.error('Error delete file:', error);
    }
  };

  const importFile = async (param) => {
    try {
      const response = await models.File.importFile(param);
      return response;
    } catch (error) {
      console.error('Error import file:', error);
    }
  };

  return {
    uploadFile,
    deleteFile,
    importFile
  };
};

export default useFile;
