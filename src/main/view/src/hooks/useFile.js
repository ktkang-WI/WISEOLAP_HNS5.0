import axios from 'axios';
import {getConfig} from 'config/config';
const contextRoot =
  process.env.NODE_ENV == 'development' ? '' : getConfig('contextRoot');
const path = document.location.origin + contextRoot + '/upload';

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

      const response = await axios.post(path + '/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const fileDelete = async (param) => {
    try {
      const response = await axios.post(path + '/delete', param);
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
