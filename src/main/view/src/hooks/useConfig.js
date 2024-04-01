import {setSpreadLicense}
  from 'components/report/atomic/spreadBoard/util/SpreadCore';
import {useDispatch} from 'react-redux';
import ConfigSlice from 'redux/modules/ConfigSlice';
import {generalConfigure} from 'routes/loader/LoaderConfig';

const useConfig = () => {
  const dispatch = useDispatch();
  const {addConfigure} = ConfigSlice.actions;

  const saveConfiguration = async () => {
    const general = await generalConfigure();
    dispatch(addConfigure(general));

    setMainTitle(general.generalConfigure.mainTitle);
    setSpreadLicense(
        general.generalConfigure.spreadJsDesignLicense,
        general.generalConfigure.spreadJsLicense
    );
  };

  const remove = () => {
    console.log('config delete');
  };

  const setMainTitle = (title) => {
    document.title = title;
  };

  return {saveConfiguration, remove};
};

export default useConfig;
