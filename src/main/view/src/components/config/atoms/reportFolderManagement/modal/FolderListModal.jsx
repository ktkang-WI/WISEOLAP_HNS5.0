import Modal from 'components/common/atomic/Modal/organisms/Modal';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import localizedString from 'config/localization';
import {getTheme} from 'config/theme';
import {useEffect, useState} from 'react';
import TreeList, {
  Column,
  Selection} from 'devextreme-react/tree-list';
import folderImg from 'assets/image/icon/report/folder_load.png';
import {managementData} from
  // eslint-disable-next-line max-len
  'components/config/organisms/reportFolderManagement/data/ReportFolderManagementData';
import TreeListInstance from 'devextreme/ui/tree_list';
import {getRefInstance} from 'components/config/utility/utility';

const theme = getTheme();

const FolderListModal = ({...props}) => {
  const [dataSource, setDataSource] = useState([]);
  const [row, setRow] = useState({});

  useEffect(() => {
    const getFolderIdList = (reportList) => {
      return reportList.reduce((acc, v) => {
        if (!acc.includes(v.fldId)) {
          acc.push(v.fldId);
        }
        return acc;
      }, []);
    };

    managementData[1].data()
        .then((response) => {
          if (response.data.data) {
            let newData = response.data.data;
            if (props.type === 'report') {
              const reportList = getRefInstance(TreeListInstance, 'report-list')
                  .option('dataSource');
              const fldIdList = getFolderIdList(reportList);
              newData = newData.filter((row) => fldIdList.includes(row.fldId));
            }
            setDataSource(newData);
          }
        })
        .catch(() => {
          throw new Error('Failed get Folders');
        });
  }, []);

  const handleRowClick = ({data}) => {
    let newData = data;
    if (props.listInstance) {
      const reportData = props.listInstance.option('dataSource')
          .find((row) => row.key === props.listInstance
              .option('selectedRowKeys')[0]);
      newData = {
        ...reportData,
        ...data
      };
    }
    setRow(newData);
  };

  const onClick = (e) => {
    const newRow = {
      fldParentId: row.fldId,
      fldParentNm: row.fldNm
    };
    props.setRow({
      ...props.row,
      ...newRow
    });
  };

  return (
    <Modal
      modalTitle={localizedString.selectFolder}
      height={theme.size.bigModalHeight}
      width={theme.size.middleModalHeight}
      onSubmit={onClick}
      {...props}
    >
      <ModalPanel title={localizedString.folderList}>
        <TreeList
          dataSource={dataSource}
          keyExpr="fldId"
          parentIdExpr="fldParentId"
          id="modalFolderList"
          height={'90%'}
          onRowClick={handleRowClick}
        >
          <Selection mode="single" />
          <Column
            dataField="fldNm"
            caption={localizedString.folderName}
            cellRender={({row}) => {
              return (
                <span>
                  <img height={'17px'} src={folderImg}/>
                  {row.data.fldNm}
                </span>
              );
            }}
          />
        </TreeList>
      </ModalPanel>
    </Modal>
  );
};

export default FolderListModal;
