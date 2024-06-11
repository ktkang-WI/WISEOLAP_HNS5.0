import Modal from 'components/common/atomic/Modal/organisms/Modal';
import Wrapper from 'components/common/atomic/Common/Wrap/Wrapper';
import ModalPanel from 'components/common/atomic/Modal/molecules/ModalPanel';
import {getTheme} from 'config/theme';
import {useSelector, useDispatch} from 'react-redux';
import {useRef, useState} from 'react';
import ItemSlice from 'redux/modules/ItemSlice';
import {selectCurrentReportId} from 'redux/selector/ReportSelector';
import HyperlinkGrid from '../atomic/Hyperlink/molecules/HyperlinkGrid';
import HyperlinkForm from '../atomic/Hyperlink/molecules/HyperlinkForm';
import localizedString from 'config/localization';

const theme = getTheme();

const ID_STR = 'HYPER_LINK_';

const HyperlinkModal = ({item, ...props}) => {
  const reportId = useSelector(selectCurrentReportId);

  const [hyperlinks, setHyperlinks] = useState(
      _.cloneDeep(item.meta.hyperlinks || []));
  const [selectedItem, setSelectedItem] = useState({});

  const formRef = useRef();
  const gridRef = useRef();

  const dispatch = useDispatch();

  const {updateItem} = ItemSlice.actions;

  const btnStyle = {
    width: 'auto',
    padding: '10px'
  };

  const newBtn = {
    ...btnStyle,
    text: localizedString.new,
    onClick: () => {
      setSelectedItem({});
    }
  };

  const saveBtn = {
    ...btnStyle,
    text: localizedString.save,
    onClick: () => {
      const res = formRef.current.instance.validate();

      if (!res.isValid) {
        return;
      }

      let id = selectedItem.id;
      // 아이디가 없는 경우 새 아이템
      if (!id) {
        id = ID_STR + 1;

        if (hyperlinks.length > 0) {
          const num = Number(hyperlinks[hyperlinks.length - 1].id.
              replace(ID_STR, '')) + 1;
          id = ID_STR + num;
        }

        const newSelectedItem = {
          id: id,
          ...selectedItem
        };

        setHyperlinks([...hyperlinks, newSelectedItem]);
        setSelectedItem({});
        return;
      }

      const newVariationValues = hyperlinks.reduce((acc, v) => {
        if (v.id != id) {
          acc.push(v);
        } else {
          acc.push(selectedItem);
        }

        return acc;
      }, []);

      setHyperlinks(newVariationValues);
    }
  };

  const onFieldDataChanged = ({dataField, value}) => {
    setSelectedItem({
      ...selectedItem,
      [dataField]: value
    });
  };

  const onSelectionChanged = (e) => {
    if (e.selectedRowsData.length == 0) {
      setSelectedItem({});
    } else {
      setSelectedItem(e.selectedRowsData[0]);
    }
  };

  const onSubmit = () => {
    const newItem = {
      ...item,
      meta: {
        ...item.meta,
        hyperlinks: hyperlinks
      }
    };

    dispatch(updateItem({
      reportId,
      item: newItem
    }));
  };

  return (
    <Modal
      width={theme.size.bigModalWidth}
      height={theme.size.middleModalHeight}
      modalTitle={localizedString.hyperlinkSetting}
      onSubmit={onSubmit}
      {...props}
    >
      <Wrapper
        direction={'row'}
        display={'flex'}
      >
        <ModalPanel
          title={localizedString.hyperlinkList}
        >
          <HyperlinkGrid
            onSelectionChanged={onSelectionChanged}
            gridRef={gridRef}
            dataSource={hyperlinks}
          />
        </ModalPanel>
        <ModalPanel
          headerButtons={[
            newBtn,
            saveBtn
          ]}
          title={localizedString.hyperlinkInformation}
        >
          <HyperlinkForm
            formData={selectedItem}
            onFieldDataChanged={onFieldDataChanged}
            formRef={formRef}
          />
        </ModalPanel>
      </Wrapper>
    </Modal>
  );
};

export default HyperlinkModal;
