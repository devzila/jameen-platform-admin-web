import React from "react"
import ReactPaginate from 'react-paginate'

export default function Paginate({forcePage, pageCount, pageRangeDisplayed, onPageChange}) {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="next >"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName="pagination justify-content-center"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      activeClassName="active"
      onPageChange={onPageChange}
      pageRangeDisplayed={pageRangeDisplayed}
      pageCount={pageCount}
      previousLabel="< previous"
      renderOnZeroPageCount={null}
      forcePage={forcePage}
    />
  )
}
