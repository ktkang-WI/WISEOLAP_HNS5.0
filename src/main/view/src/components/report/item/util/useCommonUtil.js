// import useModal from 'hooks/useModal';

const useCommonUtil = () => {
  // const {alert} = useModal();
  const dataFieldOption = useSelector(selectCurrentDataFieldOption);

  const querySearchRequiredValueChecker = () => {
    console.log(dataFieldOption);
  };

  return {
    querySearchRequiredValueChecker
  };
};

export default useCommonUtil;
