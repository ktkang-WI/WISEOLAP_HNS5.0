const Pager = ({
  pagingOption,
  dataLength,
  page,
  pageSize,
  onChangePageSize = () => {},
  onChangePage = () => {}
}) => {
  const {pageUsageOfPageCount} = pagingOption;
  const maxPage = Math.ceil(dataLength / pageSize);

  const changePageSize = (size) => {
    onChangePageSize(size);
  };

  const chagePage = (pageNumber) => {
    onChangePage(pageNumber);
  };

  const getPageSizes = () => {
    if (!pageUsageOfPageCount.isOk) return;

    return pageUsageOfPageCount.pageSizes.map((size) => (
      <div
        onClick={() => changePageSize(size)}
        key={'page-size-' + size}
        className={'dx-page-size dx-first-child' +
        (pageSize == size ? ' dx-selection' : '')}
        role="button"
        aria-label={'Items per page: ' + size}>
        {size}
      </div>
    ));
  };

  const getPageNumbers = () => {
    const pageNumbers = [];

    const sparator = (<div className="dx-separator">. . .</div>);

    const getNumber = (n) => {
      return (
        <div
          onClick={() => chagePage(n)}
          className={'dx-page' + (page == n ? ' dx-selection' : '')}
          role="button"
          key={'page-number-' + n}
          aria-label={'Page ' + n}>
          {n}
        </div>
      );
    };

    if (maxPage <= 5) {
      for (let i = 1; i <= maxPage; i++) {
        pageNumbers.push(getNumber(i));
      }

      return pageNumbers;
    }

    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(startPage + 3, maxPage);

    if (page < 4) {
      endPage = 5;
    }

    if (endPage == maxPage - 1) {
      endPage++;
    }

    if (page > maxPage - 2) {
      startPage = maxPage - 4;
    }

    if (startPage == 2) {
      startPage = 1;
    }

    if (startPage > 1) {
      pageNumbers.push(getNumber(1));
      pageNumbers.push(sparator);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(getNumber(i));
    }

    if (page < maxPage - 2 && endPage != maxPage) {
      pageNumbers.push(sparator);
      pageNumbers.push(getNumber(maxPage));
    }

    return pageNumbers;
  };

  return (
    <div
      className="dx-widget dx-datagrid-pager dx-pager"
      role="navigation"
      aria-label="Page Navigation"
    >
      <div className="dx-page-sizes">
        {getPageSizes()}
      </div>
      <div className="dx-pages">
        <div className="dx-page-indexes">
          {getPageNumbers()}
        </div>
      </div>
    </div>
  );
};

export default Pager;
