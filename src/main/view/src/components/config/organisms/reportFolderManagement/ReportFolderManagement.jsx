import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import React, {createContext, useEffect, useState}
  from 'react';
import {Mode,
  dataPrepro,
  managementData} from './data/ReportFolderManagementData';
import {Folder, Report} from
  'models/config/reportFolderManagement/ReportFolderManagement';
import localizedString from 'config/localization';
import useModal from 'hooks/useModal';
import Form from 'devextreme/ui/form';
import TreeList from 'devextreme/ui/tree_list';
import {getHint, getRefInstance} from 'components/config/utility/utility';
import AddRibbonBtn
  from 'components/common/atomic/Ribbon/atom/AddRibbonBtn';
import ConfigHeader from 'components/config/atoms/common/ConfigHeader';
import ConfigTabs from '../common/ConfigTabs';
import {iconMapper} from '../common/ConfigUtility';

export const ReportFolderContext = createContext();

const ReportFolderManagement = () => {
  const {alert} = useModal();

  const btns = ['plus', 'save', 'remove'];
  const [management, setManagement] = useState(managementData[0]);
  const [page, setPage] = useState(managementData[0].value);
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

  const init = () => {
    management.data().then((res) => {
      if (res.data.data) {
        const newData = dataPrepro({data: res.data.data,
          mode: management.value});
        setData(newData);
      }
    }).catch((e) => {
      console.log(e);
    });
  };

  useEffect(() => {
    init();
  }, []);

  const handleBtnClick = (icon) => {
    let instance = {};
    let listRef = '';
    let infoRef = '';

    if (management.value === Mode.REPORT_MANAGEMENT) {
      listRef = getRefInstance(TreeList, 'report-list');
      infoRef = getRefInstance(Form, 'report-information');
      const reportInfoFormData = infoRef.option('formData');
      instance = new Report(reportInfoFormData);
    }
    if (management.value === Mode.FOLDER_MANAGEMENT) {
      listRef = getRefInstance(TreeList, 'folder-list');
      infoRef = getRefInstance(Form, 'folder-information');
      const folderInfoFormData = infoRef.option('formData');
      instance = new Folder(folderInfoFormData);
    }

    switch (icon) {
      case 'plus':
        handlePlus(listRef);
        break;
      case 'save':
        handleSave(instance, listRef, infoRef);
        break;
      case 'remove':
        handleRemove(instance, listRef, infoRef);
        break;
      default:
        break;
    }
  };

  const handlePlus = (listRef) => {
    clearRef(listRef);
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
          .catch((e) => {
            console.error(e);
            throw new Error('Failed Update Report');
          });
    };
    validateAndProcess(infoRef.validate(), saveReport);
  };

  const handleSave = (instance, listRef, infoRef) => {
    if (management.value === Mode.REPORT_MANAGEMENT) {
      handleSaveReport(instance, listRef, infoRef);
    }
    if (management.value === Mode.FOLDER_MANAGEMENT) {
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
        .catch((e) => {
          console.error(e);
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
          console.error(e);
          throw new Error('Failed Remove Report');
        });
  };

  const handleRemove = (instance, listRef, infoRef) => {
    if (management.value === Mode.REPORT_MANAGEMENT) {
      handleRemoveReport(instance, listRef, infoRef);
    }
    if (management.value === Mode.FOLDER_MANAGEMENT) {
      handleRemoveFolder(instance, listRef, infoRef);
    }
  };

  const navBarItems = () => {
    if (management.value === Mode.FOLDER_MANAGEMENT) {
      return (
        btns.map((item, index) => (
          <AddRibbonBtn
            key={index}
            item={{
              'imgSrc': iconMapper[item],
              'width': item == 'key' ? '70px' : undefined,
              'onClick': () => handleBtnClick(item),
              'label': getHint(item)
            }}
          />
        ))
      );
    } else if (management.value === Mode.REPORT_MANAGEMENT) {
      return (
        btns.filter((item) => item !== 'plus')
            .map((item, index) => (
              <AddRibbonBtn
                key={index}
                item={{
                  'imgSrc': iconMapper[item],
                  'width': item == 'key' ? '70px' : undefined,
                  'onClick': () => handleBtnClick(item),
                  'label': getHint(item)
                }}
              />
            ))
      );
    };
  };

  const handleTabPanelItem = (mode) => {
    if (mode == page) return;
    const item = managementData.find((d) => d.value == mode);

    item.data().then((res) => {
      if (res.data.data) {
        const newData = dataPrepro({data: res.data.data, mode});
        setManagement(item);
        setPage(mode);
        setData(newData);
      }
    }).catch((e) => {
      console.log(e);
    });
  };

  return (
    <ReportFolderContext.Provider
      value={context}>
      <Wrapper display='flex' direction='column'>
        <ConfigHeader>
          {navBarItems(management.value)}
        </ConfigHeader>
        <ConfigTabs
          tabItems={managementData}
          onChangedValue={handleTabPanelItem}
          page={page}
        >
        </ConfigTabs>
      </Wrapper>
    </ReportFolderContext.Provider>
  );
};

export default React.memo(ReportFolderManagement);
