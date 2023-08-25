import {TextBox, Popover, List} from 'devextreme-react';
import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import Wrapper from './Wrapper';
import CommonButton from './CommonButton';
import {useRef} from 'react';

const theme = getTheme();

const ListFilter = ({items=[], ...props}) => {
  const popOverRef = useRef();

  const Footer = styled.div`
    display: flex;
    flex-direction: row;
    height: 50px;
    flex-wrap: nowrap;
    align-items: flex-end;
    justify-content: center;
  `;

  const renderContent = () => {
    const StyledList = styled(List)`
      .dx-list-item-content {
        font: ${theme.font.filterContent};
      }
    `;

    const confirm = () => {
      popOverRef.current.instance.hide();
    };

    const cancel = () => {
      popOverRef.current.instance.hide();
    };

    return (
      <Wrapper>
        <StyledList
          selectionMode='multiple'
          showSelectionControls={true}
          selectAllMode={'allPage'}
          selectedByClick={true}
          height="200px"
          items={['1', '2', '3', '4', '5', '6']}
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
  };

  return (
    <>
      <div id={props.id + '_wrapper'}>
        <TextBox
          focusStateEnabled={false}
          hoverStateEnabled={false}
          height={theme.size.filterHeight}
          readOnly={true}
          {...props}
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
        contentRender={renderContent}
      >
      </Popover>
    </>
  );
};

export default ListFilter;
