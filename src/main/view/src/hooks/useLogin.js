import {useNavigate} from 'react-router-dom';
import configureUtility
  from 'components/config/organisms/configurationSetting/ConfigureUtility';
import useLayout from './useLayout';
import {generalConfigure as generalLoader} from 'routes/loader/LoaderConfig';
import {getInitPageAndSetingFunc} from 'components/login/organisms/SignIn';
import useModal from './useModal';

export const useLoginHook = () => {
  const nav = useNavigate();
  const {alert} = useModal();
  const {configStringToJson} = configureUtility();
  const {afterLoginInitSettingLayout} = useLayout();

  const handleFetchData = async (res, message) => {
    if (!res) return;
    if (res.status === 200) {
      const personalConfig = res.data;

      if (!personalConfig) return;
      const config = await generalLoader();

      const getInitPage = getInitPageAndSetingFunc(
          config,
          personalConfig,
          configStringToJson,
          afterLoginInitSettingLayout
      );

      nav(getInitPage.toLowerCase());
    } else if (res.response?.status === 500) {
      document.activeElement.blur();
      alert(message);
    }
  };

  return handleFetchData;
};
