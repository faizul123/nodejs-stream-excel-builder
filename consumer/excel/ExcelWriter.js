const ExcelJS = require('exceljs');

class ExcelWriter {
    constructor(options = {}) {
        this.workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
            useSharedStrings: true,
            filename: './streamed-workbook.xlsx',
        });
        this.worksheet = this.workbook.addWorksheet('Transactions');
    }

    addRow(rows) {
       this.worksheet.addRows(rows);
       this.worksheet.commit();
    }

    commit() {
        this.workbook.commit();
    }

}

module.exports = ExcelWriter;
