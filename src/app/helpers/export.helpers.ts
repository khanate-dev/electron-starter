import { utils, writeFile } from 'xlsx';

export type ExportToExcelOpts = {
	fileName: string;
	data: unknown[];
	skipHeader?: boolean;
};

export const exportToExcel = ({
	fileName,
	data,
	skipHeader,
}: ExportToExcelOpts) => {
	const workbook = utils.book_new();
	utils.book_append_sheet(workbook, utils.json_to_sheet(data, { skipHeader }));
	writeFile(workbook, `${fileName}.xlsx`);
};
