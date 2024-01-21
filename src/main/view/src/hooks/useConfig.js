import {useDispatch} from 'react-redux';

const useConfig = () => {
  const dispatch = useDispatch();

  const save = () => {
    console.log('config save');
  };

  const remove = () => {
    console.log('config delete');
  };

  return {save, remove};
};

export default useConfig;
