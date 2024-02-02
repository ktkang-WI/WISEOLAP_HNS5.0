import {useDispatch} from 'react-redux';

const useConfig = () => {
  const dispatch = useDispatch();

  const saveConfiguration = () => {
    console.log('save configuration');
  };

  const remove = () => {
    console.log('config delete');
  };

  return {save, remove};
};

export default useConfig;
