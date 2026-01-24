const Pagination = ({ currentPage, totalPages, onPageChange }) => {
   const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 3;

      if (totalPages <= maxVisiblePages) {
         // show all pages if total pages less than max visible pages
         for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
         }
      } else {
         // always show the first page
         pages.push(1);

         let startPage = Math.max(2, currentPage - 1);
         let endPage = Math.min(totalPages - 1, currentPage + 1);

         // 调整范围以确保始终显示固定数量的页码
         if (currentPage <= 2) {
            endPage = Math.min(maxVisiblePages - 1, totalPages - 1);
         } else if (currentPage >= totalPages - 1) {
            startPage = Math.max(2, totalPages - maxVisiblePages + 2);
         }

         // 添加省略号（如果需要）
         if (startPage > 2) {
            pages.push('...');
         }

         // 添加中间页码
         for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
         }

         // 添加省略号（如果需要）
         if (endPage < totalPages - 1) {
            pages.push('...');
         }

         // 总是显示最后一页
         if (totalPages > 1) {
            pages.push(totalPages);
         }
      }

      return pages;
   };

   if (totalPages <= 1) return null;

   return (
      <div className="flex justify-center items-center gap-2 my-8">
         {/* Previous Button */}
         <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${
               currentPage === 1
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            aria-label="Previous page"
         >
            &laquo;
         </button>

         {/* Page Numbers */}
         {getPageNumbers().map((page, index) => {
            if (page === '...') {
               return (
                  <span
                     key={`ellipsis-${index}`}
                     className="px-3 py-2 text-gray-500"
                  >
                     ...
                  </span>
               );
            }

            return (
               <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                     currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
               >
                  {page}
               </button>
            );
         })}

         {/* Next Button */}
         <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${
               currentPage === totalPages
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            aria-label="Next page"
         >
            &raquo;
         </button>
      </div>
   );
};

export default Pagination;
