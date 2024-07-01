import Overlay from '../../Common/Wrap/Overlay';
import styled from 'styled-components';
import Wrapper from '../../Common/Wrap/Wrapper';
import loadingImg from 'assets/image/component/loading.gif';
import {selectJobQuantity} from 'redux/selector/LoadingSelector';
import {useSelector} from 'react-redux';
import {useContext} from 'react';
import {AppContext} from 'App';
import {sessionKey} from 'hooks/useAxiosSetting';
import localizedString from 'config/localization';

const ImgWrapper = styled(Wrapper)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 100px;
  height: 160px;
  z-index: 99999999999;
`;

const LoadingImg = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${loadingImg});
  background-repeat: no-repeat;
  background-size: 100px 100px;
`;

const CancelButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #3FA2F6;
  color: white;
  border: none;
  border-radius: 5px;
`;

const LoadingPanel = () => {
  const jobQuantity = useSelector(selectJobQuantity);
  const getContext = useContext(AppContext);
  const controllers = getContext.controllers;

  // 세션중지 PATH 입력 쿼리실행, 쿼리직접입력 테이블항목
  const isThereQuerySession = sessionKey.some((session) => {
    return Object.keys(controllers).includes(session);
  });

  const handleCancel = () => {
    if (!isThereQuerySession) return;
    if (!controllers) return;

    const deleteSessionIndex = [];

    sessionKey.forEach((session) => {
      const isToDeleteSession = Object.keys(controllers).includes(session);
      if (!isToDeleteSession) return;
      deleteSessionIndex.push(session);
    });

    deleteSessionIndex.forEach((session) => {
      controllers[session].abort();
      delete controllers[session];
    });
  };

  if (jobQuantity === 0) return null;

  return (
    <Overlay zIndex={2000}>
      <ImgWrapper>
        <LoadingImg />
        {isThereQuerySession ?
        <CancelButton onClick={handleCancel}>
          {localizedString.cancel}
        </CancelButton> : <></>}
      </ImgWrapper>
    </Overlay>
  );
};

export default LoadingPanel;
