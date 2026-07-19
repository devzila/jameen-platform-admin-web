"use client";

import React from "react";
import ReactPaginate from "react-paginate";

export default function Paginate({
  forcePage,
  pageCount,
  pageRangeDisplayed,
  onPageChange,
}) {
  return (
    <div className="admin-pagination">
      <ReactPaginate
        breakLabel="..."
        nextLabel="›"
        previousLabel="‹"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination justify-content-center d-flex list-unstyled mb-0"
        pageClassName="page-item mx-1"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        activeClassName="active"
        onPageChange={onPageChange}
        pageRangeDisplayed={pageRangeDisplayed}
        pageCount={pageCount}
        renderOnZeroPageCount={null}
        forcePage={forcePage}
      />
    </div>
  );
}
