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

const FolderListModal = ({myPageFlag, ...props}) => {
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

    managementData[2].data(myPageFlag)
        .then((response) => {
          if (response.data.data) {
            let newData = response.data.data;
            if (myPageFlag) newData = response.data.data.folder;
            if (props.type === 'report') {
              const reportList = getRefInstance(TreeListInstance, 'report-list')
                  .option('dataSource');
              const fldIdList = getFolderIdList(reportList);
              newData = newData.filter((row) => fldIdList.includes(row.fldId));
            } else {
              if (!myPageFlag) {
                newData.unshift({
                  'fldId': -1,
                  'fldNm': '최상위 폴더',
                  'fldLvl': 0,
                  'fldParentId': 0,
                  'fldOrdinal': 0,
                  'fldDesc': null});
              }
              // 최상위 폴더 생성
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
    newData.fldParentNm = data.name;
    setRow(newData);
  };

  const onClick = (e) => {
    let newRow = {};
    if (props.type === 'report') {
      newRow = {
        fldId: row.fldId,
        fldNm: row.fldNm,
        fldParentNm: row.fldNm
      };
    } else {
      newRow = {
        // 최상위 폴더 선택시 예외처리
        fldParentId: myPageFlag ? row.id : (row.fldId === -1 ? 0 : row.fldId),
        fldParentNm: myPageFlag? row.name : row.fldNm
      };
    }
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
          keyExpr={myPageFlag? 'id' : 'fldId'}
          parentIdExpr="fldParentId"
          id="modalFolderList"
          height={'90%'}
          onRowClick={handleRowClick}
        >
          <Selection mode="single" />
          <Column
            dataField={myPageFlag? 'name' : 'fldNm'}
            caption={localizedString.folderName}
            cellRender={({row}) => {
              return (
                <span>
                  <img height={'17px'} src={folderImg}/>
                  {myPageFlag? row.data.name : row.data.fldNm}
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
