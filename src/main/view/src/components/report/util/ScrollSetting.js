const ScrollSetting = {};
ScrollSetting.getScrollOptions = ({type, overflowYItems}) => {
  if (!type || !overflowYItems) return {className: '', overflowY: 'hidden'};

  const isScrollable =
    overflowYItems.map((v) => v.toUpperCase()).includes(type.toUpperCase());

  return {
    className: isScrollable ? 'custom-scrollbar-container' : '',
    overflowY: isScrollable ? 'scroll' : 'hidden'
  };
};

export default ScrollSetting;
