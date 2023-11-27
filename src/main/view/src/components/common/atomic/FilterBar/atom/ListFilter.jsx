import {TextBox, Popover, List} from 'devextreme-react';
import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import Wrapper from '../../Common/Wrap/Wrapper';
import CommonButton from '../../Common/Button/CommonButton';
import {useCallback, useEffect, useRef, useState} from 'react';
import _ from 'lodash';

const theme = getTheme();

const ListFilter = ({info, value, isTo, onValueChanged, ...props}) => {
  const index = isTo ? 1 : 0;
  const [selectionKeys, setSelectionKeys] = useState([]);
  const [text, setText] = useState('');
  const popOverRef = useRef();
  const listRef = useRef();

  const generateCaptionText = (keys) => {
    if (!value) return '';
    const temp = _.cloneDeep(keys);
    let tempText = '';

    for (const item of value.listItems) {
      const index = temp.indexOf(item.name);
      if (index >= 0) {
        tempText += item.caption + ', ';
        temp.splice(index, 1);
      }
      if (temp.length == 0) {
        break;
      }
    }
    if (tempText.length > 0) {
      tempText = tempText.substring(0, tempText.length - 2);
    } else {
      return '전체';
    }

    return tempText;
  };

  useEffect(() => {
    let keys = value && value.value ? _.cloneDeep(value.value[index]) : '';

    if (!value || !value.value) {
      setText('');
    } else if (!keys || keys == '[All]') {
      keys = value.listItems.map((item) => item.name);
      setText('전체');
    } else {
      keys = keys.split(', ');
      setText(generateCaptionText(keys));
    }
    setSelectionKeys(keys);
  }, [info, value]);

  const Footer = styled.div`
    display: flex;
    flex-direction: row;
    height: 50px;
    flex-wrap: nowrap;
    align-items: flex-end;
    justify-content: center;
  `;

  const renderContent = useCallback(() => {
    const StyledList = styled(List)`
      .dx-list-item-content {
        font: ${theme.font.filterContent};
      }
    `;

    const confirm = () => {
      const selectionKeys = listRef.current.instance.option('selectedItemKeys');
      let selection;
      if (selectionKeys.length == 0 ||
          selectionKeys.length == dataSource.length) {
        selection = '[All]';
      } else {
        selection = selectionKeys.join(', ');
      }

      onValueChanged(info.name, selection, index);
      setSelectionKeys(selectionKeys);
      setText(generateCaptionText(selectionKeys));
      popOverRef.current.instance.hide();
    };

    const cancel = () => {
      popOverRef.current.instance.hide();
    };

    const dataSource = value ? _.cloneDeep(value.listItems) : [];
    let selectionMode = info.multiSelect ? 'multiple' : 'single';

    if (selectionMode == 'multiple' && info.useAll) {
      selectionMode = 'all';
    } else if (info.useAll) {
      dataSource.unshift({
        name: '[All]',
        caption: '전체'
      });
    }

    return (
      <Wrapper>
        <StyledList
          selectionMode={selectionMode}
          showSelectionControls={true}
          selectAllText='전체'
          selectAllMode={'allPage'}
          selectedByClick={true}
          height='200px'
          displayExpr='caption'
          keyExpr='name'
          ref={listRef}
          defaultSelectedItemKeys={selectionKeys}
          dataSource={dataSource}
        >
        </StyledList>
        <Footer>
          <CommonButton type='primary' maxWidth='120px' onClick={confirm}>
            확인
          </CommonButton>
          <CommonButton type='secondary' maxWidth='120px' onClick={cancel}>
            취소
          </CommonButton>
        </Footer>
      </Wrapper>
    );
  }, [value, selectionKeys]);

  return (
    <>
      <div id={props.id + '_wrapper'}>
        <TextBox
          focusStateEnabled={false}
          hoverStateEnabled={false}
          height={theme.size.filterHeight}
          readOnly={true}
          value={text}
        />
      </div>
      <Popover
        target={'#' + props.id + '_wrapper'}
        showEvent={'click'}
        minWidth="200px"
        height="300px"
        ref={popOverRef}
        width={props.width}
        maxWidth={props.width? props.width : '200px'}
        hideOnOutsideClick
        contentRender={renderContent}
      >
      </Popover>
    </>
  );
};

export default ListFilter;
