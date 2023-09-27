import {getTheme} from 'config/theme';
import {styled, css} from 'styled-components';
import Modal from '../../common/atomic/Modal/organisms/Modal';
import localizedString from '../../../config/localization';
import ModalPanel from '../../common/atomic/Modal/molecules/ModalPanel';
import Wrapper from '../../common/atomic/Common/Wrap/Wrapper';
import CommonDataGrid from '../../common/atomic/Common/CommonDataGrid';
import PageWrapper from '../../common/atomic/Modal/atoms/PageWrapper';
import CommonTextArea from '../../common/atomic/Common/CommonTextArea';
import {Column} from 'devextreme-react/data-grid';

const theme = getTheme();

const padding = 5;

const StyledWrapper = styled(Wrapper)`
  display: flex;
  ${(props) => props.direction == 'row' ? css`
    flex-direction: row;
  ` : css`
    flex-direction: column;
  `}
  height: ${(props) => props.height || '100%'};
  width: ${(props) => props.width || '100%'};
  padding: ${(props) => props.padding || '0'}px;
`;

const dataSourceSample = [{
  'ID': 1,
  'CompanyName': 'Premier Buy',
  'Address': '7601 Penn Avenue South',
  'City': 'Richfield',
  'State': 'Minnesota',
  'Zipcode': 55423,
  'Phone': '(612) 291-1000',
  'Fax': '(612) 291-2001',
  'Website': 'http://www.nowebsitepremierbuy.com'
}, {
  'ID': 2,
  'CompanyName': 'ElectrixMax',
  'Address': '263 Shuman Blvd',
  'City': 'Naperville',
  'State': 'Illinois',
  'Zipcode': 60563,
  'Phone': '(630) 438-7800',
  'Fax': '(630) 438-7801',
  'Website': 'http://www.nowebsiteelectrixmax.com'
}, {
  'ID': 3,
  'CompanyName': 'Video Emporium',
  'Address': '1201 Elm Street',
  'City': 'Dallas',
  'State': 'Texas',
  'Zipcode': 75270,
  'Phone': '(214) 854-3000',
  'Fax': '(214) 854-3001',
  'Website': 'http://www.nowebsitevideoemporium.com'
}, {
  'ID': 4,
  'CompanyName': 'Screen Shop',
  'Address': '1000 Lowes Blvd',
  'City': 'Mooresville',
  'State': 'North Carolina',
  'Zipcode': 28117,
  'Phone': '(800) 445-6937',
  'Fax': '(800) 445-6938',
  'Website': 'http://www.nowebsitescreenshop.com'
}, {
  'ID': 5,
  'CompanyName': 'Braeburn',
  'Address': '1 Infinite Loop',
  'City': 'Cupertino',
  'State': 'California',
  'Zipcode': 95014,
  'Phone': '(408) 996-1010',
  'Fax': '(408) 996-1012',
  'Website': 'http://www.nowebsitebraeburn.com'
}, {
  'ID': 6,
  'CompanyName': 'PriceCo',
  'Address': '30 Hunter Lane',
  'City': 'Camp Hill',
  'State': 'Pennsylvania',
  'Zipcode': 17011,
  'Phone': '(717) 761-2633',
  'Fax': '(717) 761-2334',
  'Website': 'http://www.nowebsitepriceco.com'
}, {
  'ID': 7,
  'CompanyName': 'Ultimate Gadget',
  'Address': '1557 Watson Blvd',
  'City': 'Warner Robbins',
  'State': 'Georgia',
  'Zipcode': 31093,
  'Phone': '(995) 623-6785',
  'Fax': '(995) 623-6786',
  'Website': 'http://www.nowebsiteultimategadget.com'
}, {
  'ID': 8,
  'CompanyName': 'EZ Stop',
  'Address': '618 Michillinda Ave.',
  'City': 'Arcadia',
  'State': 'California',
  'Zipcode': 91007,
  'Phone': '(626) 265-8632',
  'Fax': '(626) 265-8633',
  'Website': 'http://www.nowebsiteezstop.com'
}, {
  'ID': 9,
  'CompanyName': 'Clicker',
  'Address': '1100 W. Artesia Blvd.',
  'City': 'Compton',
  'State': 'California',
  'Zipcode': 90220,
  'Phone': '(310) 884-9000',
  'Fax': '(310) 884-9001',
  'Website': 'http://www.nowebsiteclicker.com'
}];

const SelectCubeModal = ({...props}) => {
  return (
    <Modal
      onSubmit={()=> {}}
      page={1}
      usePage
      modalTitle={localizedString.selectCube}
      height={theme.size.middleModalHeight}
      width={theme.size.middleModalWidth}
      {...props}
    >
      <PageWrapper>
        <StyledWrapper direction="row">
          <StyledWrapper width='50%' padding={padding}>
            <ModalPanel
              title={localizedString.dataSourceList}
            >
              <CommonDataGrid dataSource={dataSourceSample}>
                <Column dataField='CompanyName' caption='CompanyName'/>
                <Column dataField='CompanyName' caption='CompanyName'/>
              </CommonDataGrid>
            </ModalPanel>
          </StyledWrapper>
          <StyledWrapper width='50%' padding={padding}>
            <ModalPanel height={'60%'} title={localizedString.cubeList}>
              <CommonDataGrid dataSource={dataSourceSample}>
                <Column dataField='State' caption='State'/>
                <Column dataField='State' caption='State'/>
              </CommonDataGrid>
            </ModalPanel>
            <ModalPanel height={'40%'} title={localizedString.cubeComment}>
              <CommonTextArea value={'test용'}/>
            </ModalPanel>
          </StyledWrapper>
        </StyledWrapper>
      </PageWrapper>
    </Modal>
  );
};

export default SelectCubeModal;
