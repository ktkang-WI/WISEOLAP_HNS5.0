import {useState, useEffect} from 'react'; // Import useEffect
import {getTheme} from 'config/theme';
import {styled} from 'styled-components';
import RibbonButton from '../../Common/Button/RibbonButton';
import ribbonDefaultElement from './RibbonDefaultElement';
import RibbonPanel from '../../Common/Panel/RibbonPanel';
import OnlyImageButton from '../../Common/Button/OnlyImageButton';
import arrowLeft from '../../../../../assets/image/icon/button/arrow_left.png';
import arrowRight
  from '../../../../../assets/image/icon/button/arrow_right.png';
import CommonButton from '../../Common/Button/CommonButton';

const theme = getTheme();

const StyledRibbon = styled.div`
  width: 100vw;
  height: ${theme.size.ribbonHeight};
  border-bottom: solid 1px ${theme.color.breakLine};
  background: ${theme.color.panelColor};
  box-sizing: border-box;
  padding-left: ${theme.size.snbWidth};
`;

const Left = styled.div`
  width: auto;
  height: 100%;
  text-align: left;
  float: left;
  display: flex;
  margin-left: 10px;
  margin-right: 8px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: -8px; /* Adjust this value to match the margin-right */
    height: 100%;
    width: 1px; /* Width of the border */
    background-color: ${theme.color.breakLine};
  }
`;

const Middle = styled.div`
  width: auto;
  height: 100%;
  text-align: left;
  float: left;
  display: flex;
  margin-left: 8px;
  margin-right: 8px;
  position: relative;
  @media screen and (max-width: 720px) {
      display: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: -8px; /* Adjust this value to match the margin-right */
    height: 100%;
    width: 1px; /* Width of the border */
    background-color: ${theme.color.breakLine};
  }
`;

const Right = styled.div`
  width: auto;
  height: 100%;
  text-align: left;
  float: left;
  display: flex;
  margin-left: 8px;
  margin-right: 8px;
  position: relative;
  @media screen and (max-width: 900px) {
      display: none;
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: -8px; /* Adjust this value to match the margin-right */
    height: 100%;
    width: 1px; /* Width of the border */
    background-color: ${theme.color.breakLine};
      }
`;

const QuerySearch = styled.div`
  width: auto;
  height: 100%;
  text-align: left;
  float: right;
  display: flex;
  margin-right: 20px;
  position: relative; /* Ensure relative positioning for ::before */
  
  &::before {
    content: ''; /* Create the ::before pseudo-element */
    position: absolute;
    top: 0;
    left: -20px; /* Adjust this value for the border width */
    height: 100%;
    width: 1px; /* Width of the border */
    background-color: ${theme.color.breakLine};
  }
    
`;

const CustomMenu = styled.div`
  width: auto;
  height: 100%;
  text-align: left;
  float: left;
  display: flex;
  margin-left: 8px;
  margin-right: 8px;
  position: relative;
  @media screen and (max-width: 1200px) {
      display: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: -8px; /* Adjust this value to match the margin-right */
    height: 100%;
    width: 1px; /* Width of the border */
    background-color: ${theme.color.breakLine};
  }
`;

const CustomMenuForWrapper = styled.div`
  width: auto;
  height: 100%;
  text-align: left;
  float: left;
  display: flex;
  margin-left: 8px;
  margin-right: 8px;
  position: relative;
  @media screen and (max-width: 1280px) {
      display: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: -8px; /* Adjust this value to match the margin-right */
    height: 100%;
    background-color: ${theme.color.breakLine};
  }
`;

const CustomButtonWrapper = styled.div`
  display: none; /* Hide by default */

  @media screen and (min-width: 1280px) {
    display: none;
  }

  @media screen and (max-width: 1700px) {
    width: auto;
    height: 100%;
    text-align: left;
    float: left;
    display: flex;
    margin-left: 8px;
    margin-right: 8px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      right: -8px; /* Adjust this value to match the margin-right */
      height: 100%;
      width: 1px; /* Width of the border */
      background-color: ${theme.color.breakLine};
    }

    @media screen and (max-width: 1280px) {
      display: none;
    }
    
  }
`;

const NavigationButton = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  @media screen and (max-width: 1280px) {
    display: none;
  }
`;

const Image = styled.img`
  height: 24px;
  width: auto;
`;


const getRibbonItem = (item) => {
  if (item.type === 'RibbonButton') {
    return (
      <RibbonPanel key={item.id} position={item.position}>
        <RibbonButton
          buttonKeyId={item.id}
          label={item.label}
          imgSrc={item.imgSrc}
          title={item.title}
          width={item.width}
          height={'calc(' + theme.size.ribbonHeight + ' - 10px)'}
          useArrowButton={item.useArrowButton}
          onClick={item.onClick}
        />
      </RibbonPanel>
    );
  } else if (item.type === 'OnlyImageButton') {
    return (
      <RibbonPanel key={item.id} position={item.position}>
        <OnlyImageButton
          label={item.label}
          imgSrc={item.imgSrc}
          title={item.title}
          width={item.width}
          height={item.height}
          onClick={item.onClick}
        />
      </RibbonPanel>
    );
  } else if (item.type === 'CommonButton') {
    return (
      <RibbonPanel key={item.id} position={item.position}>
        <CommonButton
          label={item.label}
          title={item.title}
          width={item.width}
          height={item.height}
          onClick={item.onClick}
        >
          {item.label}
        </CommonButton>
      </RibbonPanel>
    );
  }
};

const itemIterator = (ribbonDefaultItems, items, position) => {
  if (!items) return;

  const itemArr = [...items];

  return itemArr.map((item) => {
    if (typeof item === 'string') {
      return getRibbonItem({...ribbonDefaultItems[item], position});
    } else if (item) {
      return getRibbonItem({...item, position});
    }
  });
};

const Ribbon = ({left, middle, right, customMenu,
  querySearch}) => {
  const ribbonDefaultItems = ribbonDefaultElement();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [visibleRange, setVisibleRange] =
    useState({start: 0, end: 5}); // Initial visible range
  const totalNum = customMenu.length;

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePrevButtonClick = () => {
    setVisibleRange((prevRange) => {
      const newStart = Math.max(prevRange.start - 1, 0);
      const newEnd = Math.max(prevRange.end - 1, newStart + 5);
      return {
        start: newStart,
        end: newEnd
      };
    });
  };

  const handleNextButtonClick = () => {
    setVisibleRange((prevRange) => {
      const newEnd = Math.min(prevRange.end + 1, totalNum);
      const newStart = Math.min(prevRange.start + 1, newEnd - 5);
      return {
        start: newStart,
        end: newEnd
      };
    });
  };

  return (
    <StyledRibbon>
      <Left>
        {itemIterator(ribbonDefaultItems, left, 'left')}
      </Left>
      <Middle>
        {itemIterator(ribbonDefaultItems, middle, 'middle')}
      </Middle>
      <Right>
        {itemIterator(ribbonDefaultItems, right, 'right')}
      </Right>
      {screenWidth <= 1700 && (
        <CustomButtonWrapper>
          <NavigationButton onClick={handlePrevButtonClick}>
            <Image
              src={arrowLeft}
            />
          </NavigationButton>
          <CustomMenuForWrapper>
            {itemIterator(
                ribbonDefaultItems,
                customMenu.slice(visibleRange.start, visibleRange.end),
                'customMenu'
            )}
          </CustomMenuForWrapper>
          <NavigationButton onClick={handleNextButtonClick}>
            <Image
              src={arrowRight}
            />
          </NavigationButton>
        </CustomButtonWrapper>
      )}
      {screenWidth > 1700 && (
        <CustomMenu>
          {itemIterator(ribbonDefaultItems, customMenu, 'customMenu')}
        </CustomMenu>
      )}
      <QuerySearch>
        {itemIterator(querySearch, 'querySearch')}
      </QuerySearch>
    </StyledRibbon>
  );
};

export default Ribbon;
