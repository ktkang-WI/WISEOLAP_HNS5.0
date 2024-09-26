const isPortal = () => {
  const params = new URLSearchParams(window.location.search);

  if (params.get('portal')) {
    return true;
  }
  return false;
};

export {
  isPortal
};
