import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {Button, TabPanel} from 'devextreme-react';
import styled from 'styled-components';
import React, {createContext, useEffect, useState}
  from 'react';
import {Mode, managementData} from './data/ReportFolderManagementData';
import {Folder, Report} from
  'models/config/reportFolderManagement/ReportFolderManagement';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import Form from 'devextreme/ui/form';
import TreeList from 'devextreme/ui/tree_list';

const Header = styled.div`
  flex: 0 0 50px;
  background-color:#e1e1e1;
`;

const Content = styled.div`
  width:100%;
  height:100%;
  display:flex;
  flex-direction: row;
  flex: 0 0 1;
`;

const NavBar = styled.div`
  width:100%;
  height:100%;
  display:flex;
  flex-direction: ${(props)=> props.direction ? props.direction : 'row'};
`;

const NavBarItem = styled.div`
  width:100%;
  height:100%;
  display:flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 30px;
  padding: 0px 3px;
`;

export const ReportFolderContext = createContext();

const ReportFolderManagement = () => {
  const {alert} = useModal();

  const btns = ['plus', 'save', 'remove'];
  const [management, setManagement] = useState(managementData[0]);
  const [data, setData] = useState([]);

  const context = {
    state: {
      data: [data, setData]
    }
  };

  const validateAndProcess = (validate, process) => {
    if (validate.isValid) {
      process();
    } else {
      alert(localizedString.validationAlert);
    }
  };

  const clearRef = (listRef) => {
    listRef.clearSelection();
  };

  const dataPrepro = ({data, mode}) => {
    if (mode === Mode.REPORT_MANAGEMENT) {
      return data.reduce((acc, v) => {
        const folderIdList = acc.map((row) => row.fldId);

        if (!folderIdList.includes(v.fldId)) {
          const fldParentId = v.fldParentId === 0 ?
          v.fldParentId : 'f_' + v.fldParentId;
          acc.push({
            fldId: v.fldId,
            fldLvl: v.fldLvl,
            fldNm: v.fldNm,
            fldOrdinal: v.fldOrdinal,
            parentId: fldParentId,
            key: 'f_' + v.fldId,
            name: v.fldNm,
            type: 'folder'
          });
        }

        acc.push({
          ...v,
          key: 'r_'+ v.reportId,
          parentId: 'f_' + v.fldId,
          name: v.reportNm
        });

        return acc;
      }, []);
    }

    if (mode === Mode.FOLDER_MANAGEMENT) {
      const getParentFldNm = (fld) => data
          .find((d) => d.fldId === fld.fldParentId).fldNm;
      return data.map((row) => {
        let newRow = {};
        if (row.fldParentId === 0) {
          newRow = {
            ...row,
            fldParentNm: '/root'
          };
        } else {
          newRow = {
            ...row,
            fldParentNm: getParentFldNm(row)
          };
        }
        return new Folder(newRow);
      });
    }
  };

  const init = () => {
    management.data().then((res) => {
      if (res.data.data) {
        const newData = dataPrepro({data: res.data.data,
          mode: management.mode});
        setData(newData);
      }
    });
  };

  useEffect(() => {
    init();
  }, []);

  const getRefInstance = (component, classNm) => {
    const element = Array.from(document.querySelectorAll('[role="tabpanel"]'))
        .filter((row) => row.className.includes('dx-item-selected'))[0]
        .getElementsByClassName(classNm);
    return component.getInstance(element[0]);
  };

  const handleBtnClick = ({component}) => {
    const icon = component.option('icon');
    let instance = {};
    let listRef = '';
    let infoRef = '';

    if (management.mode === Mode.REPORT_MANAGEMENT) {
      listRef = getRefInstance(TreeList, 'report-list');
      infoRef = getRefInstance(Form, 'report-information');
      const reportInfoFormData = infoRef.option('formData');
      instance = new Report(reportInfoFormData);
    }
    if (management.mode === Mode.FOLDER_MANAGEMENT) {
      listRef = getRefInstance(TreeList, 'folder-list');
      infoRef = getRefInstance(Form, 'folder-information');
      const folderInfoFormData = infoRef.option('formData');
      instance = new Folder(folderInfoFormData);
    }

    switch (icon) {
      case 'plus':
        handlePlus();
        break;
      case 'save':
        handleSave({instance, listRef, infoRef});
        break;
      case 'remove':
        handleRemove({instance, listRef, infoRef});
        break;
      default:
        break;
    }
  };

  const handlePlus = () => {
    clearRef(folderListRef);
  };

  const handleSaveFolder = (folder, listRef, infoRef) => {
    const saveFolder = () => {
      const action = folder.fldId === 0 ? management.save : management.update;
      const successMessage = folder.fldId === 0 ?
      localizedString.successSave : localizedString.successUpdate;

      action(folder).then((response) => {
        if (response.data.data) {
          init();
          clearRef(listRef);
          alert(successMessage);
        }
      }).catch((e) => {
        console.log(e);
        throw new Error('Failure save Folder');
      });
    };
    validateAndProcess(infoRef.validate(),
        saveFolder);
  };

  const handleSaveReport = (report, listRef, infoRef) => {
    const saveReport = () => {
      management.update(report)
          .then((response) => {
            init();
            clearRef(listRef);
            alert(localizedString.successUpdate);
          })
          .catch(() => {
            throw new Error('Failed Update Report');
          });
    };
    validateAndProcess(infoRef.validate(), saveReport);
  };

  const handleSave = ({instance, listRef, infoRef}) => {
    if (management.mode === Mode.REPORT_MANAGEMENT) {
      handleSaveReport(instance, listRef, infoRef);
    }
    if (management.mode === Mode.FOLDER_MANAGEMENT) {
      handleSaveFolder(instance, listRef, infoRef);
    }
  };

  const handleRemoveReport = (report, listRef, infoRef) => {
    management.remove(report)
        .then((response) => {
          if (response.data.result) {
            init();
            clearRef(listRef);
            alert(localizedString[response.data.msg]);
          }
        })
        .catch(() => {
          throw new Error('Failed Remove Report');
        });
  };

  const handleRemoveFolder = (report, listRef, infoRef) => {
    management.remove(report)
        .then((response) => {
          if (response.data.data) {
            init();
            clearRef(listRef);
            alert(localizedString.successRemove);
          }
        })
        .catch(() => {
          throw new Error('Failed Remove Report');
        });
  };

  const handleRemove = ({instance, listRef, infoRef}) => {
    if (management.mode === Mode.REPORT_MANAGEMENT) {
      handleRemoveReport(instance, listRef, infoRef);
    }
    if (management.mode === Mode.FOLDER_MANAGEMENT) {
      handleRemoveFolder(instance, listRef, infoRef);
    }
  };

  const navBarItems = () => {
    if (management.mode === Mode.FOLDER_MANAGEMENT) {
      return (
        btns.map((item, index) => (
          <NavBarItem key={index}>
            <Button icon={item} onClick={handleBtnClick}></Button>
          </NavBarItem>
        ))
      );
    } else if (management.mode === Mode.REPORT_MANAGEMENT) {
      return (
        btns.filter((item) => item !== 'plus')
            .map((item, index) => (
              <NavBarItem icon={item} key={index}>
                <Button icon={item} onClick={handleBtnClick}></Button>
              </NavBarItem>
            ))
      );
    };
  };

  const handleTabPanelItem = ({itemData}) => {
    const panelTitle = itemData.title;

    managementData.forEach((item) => {
      if (item.title === panelTitle) {
        item.data().then((res) => {
          if (res.data.data) {
            const newData = dataPrepro({data: res.data.data, mode: item.mode});
            setManagement(item);
            setData(newData);
          }
        });
        return;
      }
    });
  };

  return (
    <ReportFolderContext.Provider
      value={context}>
      <Wrapper display='flex' direction='column'>
        <Header>
          <NavBar>
            {navBarItems(management.mode)}
          </NavBar>
        </Header>
        <Content>
          <TabPanel
            onOptionChanged={(e) => {
              if (e.name == 'hoveredElement') return;
              console.log(e);
            }}
            className='dx-theme-background-color'
            width='100%'
            height='100%'
            dataSource={managementData}
            animationEnabled={false}
            swipeEnabled={false}
            itemComponent={management.component}
            onTitleClick={handleTabPanelItem}
            deferRendering
          >
          </TabPanel>
        </Content>
      </Wrapper>
    </ReportFolderContext.Provider>
  );
};

export default React.memo(ReportFolderManagement);
