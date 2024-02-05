import models from 'models';

const useFile = () => {
  /**
   * @param {Blob} file
   * @param {Object} param
   */
  const fileUpload = async (file, param) => {
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

  const fileDelete = async (param) => {
    try {
      const response = await models.File.deleteFile(param);
      console.log('File delete successfully:', response.data);
    } catch (error) {
      console.error('Error delete file:', error);
    }
  };

  return {
    fileUpload,
    fileDelete
  };
};

export default useFile;
