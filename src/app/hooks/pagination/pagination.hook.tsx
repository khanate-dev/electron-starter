import { useState } from 'react';

import { DEFAULT_PAGE_SIZE } from '~/app/config';

import type { PAGINATION_SIZES } from '~/app/config';

type Size = (typeof PAGINATION_SIZES)[number];

export const usePagination = <Type extends any>(
	data: Type[],
	isDisabled?: boolean,
	isZeroBased?: boolean
) => {
	const firstPage = isZeroBased ? 0 : 1;

	const [currentPage, setCurrentPage] = useState<number>(firstPage);
	const [pageSize, setPageSize] = useState<Size>(DEFAULT_PAGE_SIZE);

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
	};
};
