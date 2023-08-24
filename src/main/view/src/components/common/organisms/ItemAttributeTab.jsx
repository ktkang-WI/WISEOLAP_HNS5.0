import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import PanelTitleText from '../atoms/PanelTitleText';
import SqureButton from '../molecules/SqureButton';
import itemAttributeDefaultElement from './ItemAttributeDefaultElement';

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

  // TODO: 추후 리덕스 적용
  const tempData = ['Filtering', 'Interaction',
    'InteractionConfiguration', 'TargetDimension'];

  const generateAttribute = (attributes) => {
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
                <SqureButton
                  key={item.id}
                  label={item.label}
                  icon={item.icon}
                  onClick={item.onClick}
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
      {generateAttribute(tempData)}
    </Wrapper>
  );
};

export default ItemAttributeTab;
