import { useState } from 'react';

export const paginationSizes = [10, 20, 50, 100] as const;

export const defaultPaginationSize =
	10 satisfies (typeof paginationSizes)[number];

type Size = (typeof paginationSizes)[number];

export const usePagination = <Type extends unknown>(
	data: Type[],
	isDisabled?: boolean,
	isZeroBased?: boolean,
) => {
	const firstPage = isZeroBased ? 0 : 1;

	const [currentPage, setCurrentPage] = useState<number>(firstPage);
	const [pageSize, setPageSize] = useState<Size>(defaultPaginationSize);

	const totalRows = data.length;
	const totalPages = Math.max(Math.ceil(totalRows / pageSize), 1);

	const lastPage = isZeroBased ? totalPages - 1 : totalPages;

	if (currentPage < firstPage) setCurrentPage(firstPage);
	else if (currentPage > lastPage) setCurrentPage(lastPage);

	let paginatedData = data;
	if (!isDisabled && totalPages > 1) {
		const pageIndex = isZeroBased ? currentPage : currentPage - 1;
		const pageStart = pageIndex * pageSize;

		paginatedData = data.slice(pageStart, pageStart + pageSize);
	}

	return {
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalRows,
		totalPages,
		paginatedData,
		showPagination: !isDisabled && totalRows > Math.min(...paginationSizes),
	};
};
