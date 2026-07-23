import "../styles/pagination.css";

function Pagination({ meta, onPageChange }) {
  if (!meta || meta.last_page <= 1) return null;

  const { current_page: currentPage, last_page: lastPage } = meta;

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </button>

      <span>
        Page {currentPage} of {lastPage}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= lastPage}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
