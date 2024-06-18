import React, { useState } from 'react';

const CustomPagination = ({ totalItems, itemsPerPage, currentPage, onPageChange, onPageSelect }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  var startPage = Math.max(1, currentPage - 2);
  var endPage = Math.min(startPage + 4, totalPages);

  const renderPaginationButtons = () => {
    const buttons = [];
    buttons.push(
      <button
        key={0}
        disabled={currentPage === 1}
        className={`page-btn text-white btn btn-sm btn-theme-primary`}
        onClick={() => onPageChange(currentPage-1)}
      >
        <i className="fa fa-angle-double-left" aria-hidden="true"></i>
      </button>
    );

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`page-btn btn btn-sm ${i === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }
    // "Next" button
    buttons.push(
      <button
        key="next-button"
        disabled={currentPage === totalPages}
        className={`page-btn text-white btn page-btn btn-sm btn-theme-primary`}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <i className="fa fa-angle-double-right" aria-hidden="true"></i>
      </button>
    );

    return buttons;
  };

  return (
    <div className="pagination-container custom-pagination mt-3">
      <div className="pagination custom-pagination me-2">
        {renderPaginationButtons()}
      </div>
      <div>
        <select className='p-0 m-0' value={itemsPerPage} onChange={onPageSelect}>
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
};

export default CustomPagination;
