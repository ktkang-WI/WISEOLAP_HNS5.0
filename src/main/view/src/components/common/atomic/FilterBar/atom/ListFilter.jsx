import {TextBox, Popover} from 'devextreme-react';
import {getTheme} from 'config/theme';
import {useEffect, useRef, useState} from 'react';
import _ from 'lodash';
import localizedString from 'config/localization';
import ListFilterPopoverList from './ListFilterPopoverList';
import {isPortal} from 'components/utils/PortalUtility';

const theme = getTheme();

const allText = localizedString.all;

const ListFilter = ({
  info, value, isTo, onValueChanged, width, id, ...props}) => {
  const filterHeight = isPortal() ? '45px' : theme.size.filterHeight;
  const index = isTo ? 1 : 0;
  const [selectionKeys, setSelectionKeys] = useState([]);
  const [text, setText] = useState('');
  const popOverRef = useRef();
  const listRef = useRef();
  const textBoxRef = useRef();
  const [dataType, setDataType] = useState('');
  let listItems = value?.listItems || [];

  const generateCaptionText = (keys) => {
    if (!value) return '';

    const keySet = new Set(keys.map((key) => key + ''));
    const captionArr = [];
    for (const item of listItems) {
      if (keySet.has(item.name + '')) {
        captionArr.push(item.caption);
        keySet.delete(item.name);
      }
      if (keySet.size == 0) {
        break;
      }
    }

    if (captionArr.length === listItems.length) {
      if (!info.useAll && listItems.length > 1) {
        return allText;
      }
    }

    if (captionArr.length > 0) {
      return captionArr.join(', ');
    }

    return allText;
  };

  useEffect(() => {
    let keys = value && value.value ? _.cloneDeep(value.value[index]) : '';
    if (!value || !value.value) {
      setText('');
    // eslint-disable-next-line brace-style
    }
    /* else if (!keys || keys == '[All]') {
      if (info.multiSelect) {
        keys = value.listItems.map((item) => item.name);
      }
      setText(allText);
    } */
    else {
      if (dataType === 'number') {
        keys = keys.split(', ').map((key) => {
          return isNaN(Number(key)) ? key : Number(key);
        });
      } else {
        keys = keys.split(', ');
      }
      setText(generateCaptionText(keys));
    }
    setSelectionKeys(keys);
  }, [info, value]);

  const confirm = (_selectionKeys, _dataSource) => {
    if (_selectionKeys) {
      listRef?.current?.instance?.option('selectedItemKeys', _selectionKeys);
    }
    const selectionKeys = _selectionKeys ||
    listRef.current.instance.option('selectedItemKeys');
    const dataSource = _dataSource ||
      listRef.current.instance.option('dataSource');
    listItems = dataSource;
    let selection;
    if (selectionKeys.length == 0 ||
        (selectionKeys.length == dataSource.length) ||
        (!_dataSource && info.useAll && !info.multiSelect &&
        selectionKeys.length == dataSource.length - 1)) {
      if (info.defaultValueUseSql || info.useSearch) {
        if (typeof selectionKeys[0] === 'number') {
          setDataType(typeof selectionKeys[0]);
        }
        selection = selectionKeys.join(', ');
        setText(generateCaptionText(selectionKeys));
      } else {
        selection = '[All]';
        setText(allText);
      }
    } else {
      if (typeof selectionKeys[0] === 'number') {
        setDataType(typeof selectionKeys[0]);
      }
      selection = selectionKeys.join(', ');
      setText(generateCaptionText(selectionKeys));
    }

    if (info.useSearch) {
      let listDataSource = dataSource
          .filter((item) => item.name !== '[All]');
      if (_selectionKeys) {
        listDataSource = listDataSource
            .filter((item) => _selectionKeys.includes(item.name));
      }

      onValueChanged(info.name, selection, index, listDataSource);
    } else {
      onValueChanged(info.name, selection, index, []);
    }

    setSelectionKeys(selectionKeys);

    popOverRef.current.instance.hide();
  };

  const cancel = () => {
    listRef.current.instance.option('selectedItemKeys', selectionKeys);
    popOverRef.current.instance.hide();
  };

  let selectionMode = info.multiSelect ? 'multiple' : 'single';

  if (selectionMode == 'multiple' && info.useAll) {
    selectionMode = 'all';
  }

  const renderContent = () => {
    return (
      <ListFilterPopoverList
        info={info}
        listRef={listRef}
        confirm={confirm}
        cancel={cancel}
        allText={allText}
        orgDataSource={listItems || []}
        selectionKeys={selectionKeys}
      />
    );
  };

  return (
    <>
      <div ref={textBoxRef} id={id+'_'+ index + '_wrapper'}>
        <TextBox
          focusStateEnabled={false}
          hoverStateEnabled={false}
          height={filterHeight}
          value={text}
          width={width}
          onValueChanged={(e) => {
            const dataSource = listItems || [];
            const captions = e.value.split(',');
            const tempSelectionKeys = new Set();

            for (let caption of captions) {
              caption = caption.trim();
              const item = dataSource.find((item) => item.caption == caption);
              if (item) {
                tempSelectionKeys.add(item.name);
              }
            }

            const uniqueSelectionKeys = Array.from(tempSelectionKeys);
            confirm(uniqueSelectionKeys, dataSource);
          }}
          {...props}
        />
      </div>
      <Popover
        target={textBoxRef.current}
        showEvent={'click'}
        minWidth="250px"
        height="700px"
        ref={popOverRef}
        width={width}
        maxWidth={width || '250px'}
        hideOnOutsideClick
        contentRender={renderContent}
      >
      </Popover>
    </>
  );
};

export default ListFilter;
