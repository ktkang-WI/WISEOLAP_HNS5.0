import ChoroplethStepper
  from '../../Stepper/organism/choropleth/ChoroplethStepper';
import Modal from './Modal';
import {createContext, useState} from 'react';
import {findGeoJsonMap}
  from 'components/report/item/choropleth/DefaultChoropleth';
import useModal from 'hooks/useModal';
import {getTheme} from 'config/theme';
import localizedString from 'config/localization';

export const ChoroplethContext = createContext();

const theme = getTheme();

const ChoroplethModal = ({
  onSubmit,
  modalTitle,
  label,
  defaultValue='',
  ...props
}) => {
  // Default GeoJson
  const [geoJson, setGeoJson] = useState(findGeoJsonMap('koreaProvince'));
  const [key, setKey] = useState();
  const [singleDataOfKey, setSingleDataOfKey] = useState('');
  const [isOk, setIsOk] = useState(false);
  const {alert} = useModal();
  const context = {
    state: {
      geoJson: [
        geoJson,
        setGeoJson
      ],
      key: [
        key,
        setKey
      ],
      singleDataOfKey: [
        singleDataOfKey,
        setSingleDataOfKey
      ]
    },
    isOk: [
      isOk, setIsOk
    ]
  };

  return (
    <ChoroplethContext.Provider
      value={context}
    >
      <Modal
        modalTitle={modalTitle}
        width={theme.size.bigModalWidthPx}
        height={theme.size.bigModalHeightPx}
        onSubmit={() => {
          if (!isOk) {
            alert(localizedString.requestWorkComplete);
            return true;
          }
          onSubmit(context.state);
        }}
        {...props}
      >
        <ChoroplethStepper />
      </Modal>
    </ChoroplethContext.Provider>
  );
};

export default ChoroplethModal;
