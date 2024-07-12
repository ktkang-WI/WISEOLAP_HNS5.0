import Modal from 'components/common/atomic/Modal/organisms/Modal';

import localizedString from '../../../config/localization';
import {getTheme} from 'config/theme';
import CommonTab from 'components/common/atomic/Common/Interactive/CommonTab';

import ShowQueryEditor from '../atomic/molecules/ShowQueryEditor';
import ShowQuerySQLData from '../atomic/molecules/ShowQuerySQLData';
import React, {useCallback, useMemo} from 'react';

const theme = getTheme();

const ShowQueryModal = ({onClose, dsId, paramInfo, datasetQuery}) => {
  const tabSource = useMemo(() => [
    {
      id: 'sql',
      title: 'SQL'
    },
    {
      id: 'sqlData',
      title: 'SQL Data'
    }
  ], []);

  const getTabContent = useCallback(({data}) => {
    if (data.id === 'sql') {
      return (
        <ShowQueryEditor
          datasetQuery={datasetQuery}
        />
      );
    }

    if (data.id === 'sqlData') {
      return (
        <ShowQuerySQLData
          dsId={dsId}
          datasetQuery={datasetQuery}
          paramInfo={paramInfo}
        />
      );
    }
  }, [dsId, datasetQuery, paramInfo]);

  return (
    <Modal
      modalTitle={localizedString.showQueryExecutor}
      height={theme.size.bigModalHeight}
      width={theme.size.middleModalWidth}
      onClose={onClose}
    >
      <CommonTab
        dataSource={tabSource}
        itemComponent={getTabContent}
        width='100%'
      />
    </Modal>
  );
};

export default React.memo(ShowQueryModal);
