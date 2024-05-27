import {setSpreadLicense}
  from 'components/report/atomic/spreadBoard/util/SpreadCore';
import {useDispatch} from 'react-redux';
import ConfigSlice from 'redux/modules/ConfigSlice';

const useConfig = () => {
  const dispatch = useDispatch();
  const {addConfigure, setDisplayConfig} = ConfigSlice.actions;

  const saveConfiguration = (general) => {
    dispatch(addConfigure(general));

    setMainTitle(general.mainTitle);
    setSpreadLicense(
        general.spreadJsDesignLicense,
        general.spreadJsLicense
    );
  };

  const afterLoginInitSettingConfig = (initPage, general) => {
    dispatch(setDisplayConfig(initPage));
    saveConfiguration(general);
  };

  const remove = () => {
    console.log('config delete');
  };

  const setMainTitle = (title) => {
    document.title = title;
  };

  return {
    saveConfiguration,
    remove,
    afterLoginInitSettingConfig
  };
};

export default useConfig;
