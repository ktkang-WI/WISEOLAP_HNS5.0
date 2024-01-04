import store from 'redux/modules';
import {selectSheets} from 'redux/selector/SpreadSelector';
import spreadDefaultElement from './organisms/SpreadDefaultElement';

export default function useSpreadConfig() {
  // Ribbon Custom
  const setRibbonSetting = () => {
    const sheets = selectSheets(store.getState());
    const {SpreadRibbonDefaultElement, ribbonCommandMap, downlaodReportModel} =
      spreadDefaultElement();
    const config = sheets.Designer.DefaultConfig;
    // csutomtab 메뉴 생성
    const newTab = SpreadRibbonDefaultElement;

    // 불필요 메뉴 삭제
    delete config.fileMenu;
    config.ribbon.unshift(newTab);

    // customtab 메뉴 메소드 정의
    const commandMap = ribbonCommandMap();
    // ribbon download modal 정의
    const downlaodReportDialog = downlaodReportModel;
    // Template 기능 추가.
    addSpreadTemplate('downlaodReportDialog', downlaodReportDialog);
    config.commandMap = commandMap;
    return config;
  };

  const addSpreadTemplate = (templateName, templateMethod) => {
    const sheets = selectSheets(store.getState());
    sheets.Designer.registerTemplate(templateName, templateMethod);
  };

  return {setRibbonSetting};
};
