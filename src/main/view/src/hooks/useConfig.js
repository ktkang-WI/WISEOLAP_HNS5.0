import {setSpreadLicense}
  from 'components/report/atomic/spreadBoard/util/SpreadCore';
import {useDispatch} from 'react-redux';
import ConfigSlice from 'redux/modules/ConfigSlice';
import {useNavigate} from 'react-router';

const useConfig = () => {
  const dispatch = useDispatch();
  const {addConfigure, setMyPageConfigure} = ConfigSlice.actions;
  const nav = useNavigate();

  const saveConfiguration = (generalConfigure, myPageConfigure) => {
    if (!myPageConfigure) {
      nav('/editds');
    } else {
      dispatch(addConfigure(generalConfigure));
      dispatch(setMyPageConfigure(myPageConfigure));

      setMainTitle(generalConfigure.general.mainTitle);
      setSpreadLicense(
          generalConfigure.general.spreadJsDesignLicense,
          generalConfigure.general.spreadJsLicense
      );
    }
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
