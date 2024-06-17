import {setSpreadLicense}
  from 'components/report/atomic/spreadBoard/util/SpreadCore';
import {useDispatch} from 'react-redux';
import ConfigSlice from 'redux/modules/ConfigSlice';

const useConfig = () => {
  const dispatch = useDispatch();
  const {addConfigure, setMyPageConfigure} = ConfigSlice.actions;

  const saveConfiguration = (general, myPageConfigure) => {
    dispatch(addConfigure(general));
    dispatch(setMyPageConfigure(myPageConfigure));

    setMainTitle(general.mainTitle);
    setSpreadLicense(
        general.spreadJsDesignLicense,
        general.spreadJsLicense
    );
  };

  const remove = () => {
    console.log('config delete');
  };

  const setMainTitle = (title) => {
    document.title = title;
  };

  return {
    saveConfiguration,
    remove
  };
};

export default useConfig;
