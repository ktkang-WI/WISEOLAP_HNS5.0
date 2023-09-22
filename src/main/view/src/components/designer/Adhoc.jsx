import DesignerContent from './DesignerContent';
import Ribbon from 'components/common/atomic/Ribbon/organism/Ribbon';

const Adhoc = () => {
  return (
    <>
      <Ribbon
        left={[
          'NewReport',
          'LoadReport',
          'SaveReport',
          'DeleteReport',
          'DownloadReport'
        ]}
        middle={[
          'ConnectReport',
          'AddContainer'
        ]}
        right={[
          'AddChart',
          'AddPivotGrid',
          'AddGrid',
          'AddCustomChart'
        ]}
        customMenu={[
          'CaptionView',
          'NameEdit',
          'Rotate',
          'XAxisSetting',
          'YAxisSetting',
          'ExtraAxisSetting',
          'ShowColorLegend',
          'SeriesType',
          'Palette',
          'ColorEdit',
          'PointLabel'
        ]}
        querySearch={[
          'QuerySearch'
        ]}
      />
      <DesignerContent></DesignerContent>
    </>
  );
};
export default Adhoc;
