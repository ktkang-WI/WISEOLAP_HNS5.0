import Stepper from 'components/common/atomic/Common/Stepper/Stepper';
import PickChoropleth from '../../molecules/choropleth/PickChoropleth';
import MappingDataChoropleth
  from '../../molecules/choropleth/MappingDataChoropleth';
import useModal from 'hooks/useModal';
import {ChoroplethContext}
  from 'components/common/atomic/Modal/organisms/ChoroplethModal';
import {useContext} from 'react';
import localizedString from 'config/localization';

const steps = [
  {
    label: '지역 선택',
    content: <PickChoropleth />
  },
  {
    label: '데이터 맵핑',
    content: <MappingDataChoropleth />
  }
];

const ChoroplethStepper = () => {
  const getContext = useContext(ChoroplethContext);
  const [, setIsOk] = getContext.isOk;
  const {alert} = useModal();
  const handleComplete = () => {
    alert(localizedString.map.alert.completePickMap);
    setIsOk(true);
  };

  return (
    <Stepper
      steps={steps}
      onComplete={handleComplete} />
  );
};

export default ChoroplethStepper;
