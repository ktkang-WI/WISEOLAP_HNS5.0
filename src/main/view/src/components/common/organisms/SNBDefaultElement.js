import localizedString from '../../../config/localization';
import dashboard from '../../../assets/image/icon/button/dashboard.png';
import dashboardActive
  from '../../../assets/image/icon/button/dashboard_active.png';
import adhoc from '../../../assets/image/icon/button/adhoc.png';
import adhocActive
  from '../../../assets/image/icon/button/adhoc_active.png';
import dataset from '../../../assets/image/icon/button/dataset.png';
import datasetActive
  from '../../../assets/image/icon/button/dataset_active.png';
import preference from '../../../assets/image/icon/button/preference.png';
import preferenceActive
  from '../../../assets/image/icon/button/preference_active.png';

const SNBDefaultElement = {
  'Dashboard': {
    id: 'dashboard',
    imgSrc: dashboard,
    hoveredImgSrc: dashboardActive,
    label: localizedString.dashboard
  },
  'AdHoc': {
    id: 'adhoc',
    imgSrc: adhoc,
    hoveredImgSrc: adhocActive,
    label: localizedString.adhoc
  },
  'Dataset': {
    id: 'dataset',
    imgSrc: dataset,
    hoveredImgSrc: datasetActive,
    label: localizedString.dataset
  },
  'Preference': {
    id: 'preference',
    imgSrc: preference,
    hoveredImgSrc: preferenceActive,
    label: localizedString.preference
  }
};


export default SNBDefaultElement;
