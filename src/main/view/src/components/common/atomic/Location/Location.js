export const getContextPath = () => {
  const contextPath = window.location.pathname.split('/')[1];
  return contextPath;
};

export const getFullUrl = () => {
  const contextPath = getContextPath();
  const origin = window.location.origin;
  return `${origin}/${contextPath}`;
};
