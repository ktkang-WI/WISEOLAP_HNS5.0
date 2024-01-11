import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import PanelTitleText from '../../Common/Panel/PanelTitleText';
import SquareButton from '../../Common/Button/SquareButton';
import itemAttributeDefaultElement from './ItemAttributeDefaultElement';
import {useSelector} from 'react-redux';
import {selectCurrentItem, selectRootItem} from 'redux/selector/ItemSelector';

const theme = getTheme();

const Wrapper = styled.div`
  background: ${theme.color.background};
  height: 100%;
  width: ${theme.size.panelWidth};
  display: inline-block;
  border-right: solid 1px ${theme.color.breakLine};
`;

const AttributeWrapper = styled.div`
  width: 100%;
  height: auto;
`;

const TitleWrapper = styled.div`
  text-align: left;
  padding: 12px 15px;
  border-bottom: 1px solid ${theme.color.breakLine};
`;

const ButtonWrapper = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  padding: 10px 15px;
`;


const ItemAttributeTab = () => {
  const defaultElement = itemAttributeDefaultElement();
  const focusedItem = useSelector(selectCurrentItem);
  const rootItem = useSelector(selectRootItem);

  const generateAttribute = (attributes) => {
    if (!attributes) return;

    return attributes.map((data) => {
      const attributeGrp = defaultElement[data];

      return (
        <AttributeWrapper key={data}>
          <TitleWrapper>
            <PanelTitleText color={theme.color.primary}>
              {attributeGrp.title}
            </PanelTitleText>
          </TitleWrapper>
          <ButtonWrapper>
            {
              attributeGrp.items.map((item) =>
                <SquareButton
                  key={item.id}
                  {...item}
                />
              )
            }
          </ButtonWrapper>
        </AttributeWrapper>
      );
    });
  };

  return (
    <Wrapper>
      {generateAttribute(focusedItem?.mart.attributeItems ||
        rootItem.adHocOption.attributeItems)}
    </Wrapper>
  );
};

export default ItemAttributeTab;
