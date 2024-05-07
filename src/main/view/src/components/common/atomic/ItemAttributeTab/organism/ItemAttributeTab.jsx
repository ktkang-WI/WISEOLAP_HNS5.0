import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import PanelTitleText from '../../Common/Panel/PanelTitleText';
import SquareButton from '../../Common/Button/SquareButton';
import itemAttributeDefaultElement from './ItemAttributeDefaultElement';
import {useSelector} from 'react-redux';
import {selectCurrentItem, selectRootItem} from 'redux/selector/ItemSelector';

const theme = getTheme();

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: inline-block;
`;

const AttributeWrapper = styled.div`
  width: 100%;
  margin: 10px 0px;
  height: auto;
`;

const TitleWrapper = styled.div`
  text-align: left;
  margin-bottom: 15px;
`;

const ButtonWrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;


const ItemAttributeTab = () => {
  const defaultElement = itemAttributeDefaultElement();
  const focusedItem = useSelector(selectCurrentItem);
  const rootItem = useSelector(selectRootItem);
  const attributeItems = rootItem.adHocOption ?
  rootItem.adHocOption.attributeItems :
  focusedItem?.mart.attributeItems;

  const generateAttribute = (attributes) => {
    if (!attributes) return;

    return attributes.map((data) => {
      const attributeGrp = defaultElement[data];

      return (
        <AttributeWrapper key={data}>
          <TitleWrapper>
            <PanelTitleText color={theme.color.gray600}>
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
      {generateAttribute(attributeItems || [])}
    </Wrapper>
  );
};

export default ItemAttributeTab;
