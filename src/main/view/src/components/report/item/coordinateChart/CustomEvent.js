import itemOptionManager from '../ItemOptionManager';

const useCustomEvent = () => {
  const {commonRibbonBtn} = itemOptionManager();

  const ribbonConfig = {
    'ShowColorLegendD3': {...commonRibbonBtn['ShowColorLegendD3']}
  };

  return {
    ribbonConfig
  };
};

export default useCustomEvent;
