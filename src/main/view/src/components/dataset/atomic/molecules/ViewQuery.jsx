// eslint-disable-next-line max-len
import showQuery from 'assets/image/icon/button/showQuery.png';
import CommonButton from 'components/common/atomic/Common/Button/CommonButton';
import ShowQueryModal from 'components/dataset/modal/ShowQueryModal';
import localizedString from '../../../../config/localization';
import useModal from 'hooks/useModal';
import React from 'react';

const ViewQuery = ({dsId, paramInfo, queryEditorRef}) => {
  const {openModal} = useModal();

  const onClick = () => {
    const datasetQuery = queryEditorRef.current &&
    queryEditorRef.current.editor.getValue();
    let newParamInfo = [];
    // eslint-disable-next-line max-len
    newParamInfo = paramInfo?.filter((param)=>queryEditorRef.current.editor.getValue().indexOf(param.name) > 0);

    openModal(ShowQueryModal, {
      dsId: dsId,
      paramInfo: newParamInfo,
      datasetQuery: datasetQuery
    });
  };

  return (
    <CommonButton
      id={'ds_sql_show_query'}
      title={localizedString.showQuery}
      width={'85px'}
      height={'30px'}
      type={'whiteRound'}
      onClick={onClick}
    >
      <img src={showQuery}/>
      {localizedString.showQuery}
    </CommonButton>
  );
};

export default React.memo(ViewQuery);
