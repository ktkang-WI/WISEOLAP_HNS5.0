import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import {Button, TabPanel} from 'devextreme-react';
import styled from 'styled-components';
import React, {createContext, useCallback, useEffect, useRef, useState}
  from 'react';
import {Mode, managementData} from './data/ReportFolderManagementData';
import {Folder, Report} from
  'models/config/reportFolderManagement/ReportFolderManagement';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';

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
  const reportListRef = useRef();
  const reportInformationRef = useRef();
  const folderListRef = useRef();
  const folderInformationRef = useRef();

  const context = {
    state: {
      data: [data, setData]
    },
    ref: {
      reportListRef: reportListRef,
      reportInformationRef: reportInformationRef,
      folderListRef: folderListRef,
      folderInformationRef: folderInformationRef
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
    listRef.current._instance.clearSelection();
  };

  const dataPrepro = useCallback(({data, mode}) => {
    const getParentFldNm = (fld) => data
        .find((d) => d.fldId === fld.fldParentId).fldNm;
    return data.map((row) => {
      if (mode === Mode.REPORT_MANAGEMENT) {
        return new Report(row);
      }
      if (mode === Mode.FOLDER_MANAGEMENT) {
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
      }
    });
  }, [management]);

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

  const handleBtnClick = ({component}) => {
    const icon = component.option('icon');
    let instance = {};
    let listRef = '';
    let infoRef = '';

    if (management.mode === Mode.REPORT_MANAGEMENT) {
      const reportInfoFormData = reportInformationRef.current?._instance
          .option('formData');
      instance = new Report(reportInfoFormData);
    }
    if (management.mode === Mode.FOLDER_MANAGEMENT) {
      const folderInfoFormData = folderInformationRef.current?._instance
          .option('formData');
      instance = new Folder(folderInfoFormData);
      listRef = folderListRef;
      infoRef = folderInformationRef;
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
    validateAndProcess(folderInformationRef.current._instance.validate(),
        saveFolder);
  };

  const handleSaveReport = (report, listRef, infoRef) => {
    const saveReport = () => {
      // management.update(report)
      //     .then((response) => {
      //       init();
      //       clearRef(listRef);
      //       alert(localizedString.successUpdate);
      //     })
      //     .catch(() => {
      //       throw new Error('Failed Update Report');
      //     });
      alert('기능 점검 중입니다.');
    };
    validateAndProcess(reportInformationRef.current._instance.validate(),
        saveReport);
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

  const handleTabPanelItem = useCallback(({itemData}) => {
    const panelTitle = itemData.title;

    managementData.forEach((item) => {
      if (item.title === panelTitle) {
        item.data().then((res) => {
          if (res.data.data) {
            setManagement(item);
            const newData = dataPrepro({data: res.data.data, mode: item.mode});
            setData(newData);
          }
        });
        return;
      }
    });
  }, [management, data]);

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
            className='dx-theme-background-color'
            width='100%'
            height='100%'
            dataSource={managementData}
            animationEnabled={false}
            swipeEnabled={false}
            itemComponent={management.component}
            onTitleClick={handleTabPanelItem}
          >
          </TabPanel>
        </Content>
      </Wrapper>
    </ReportFolderContext.Provider>
  );
};

export default React.memo(ReportFolderManagement);
