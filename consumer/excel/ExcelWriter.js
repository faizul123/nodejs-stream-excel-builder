const ExcelJS = require('exceljs');

class ExcelWriter {
    constructor(options = {}) {
        this.workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
            useSharedStrings: true,
            filename: './streamed-workbook.xlsx',
        });
        this.worksheet = this.workbook.addWorksheet('Transactions');
        this.worksheet.columns = [
            { header: 'Account Number', key: 'accountNumber', },
            { header: 'Account Type', key: 'accountType' },
            { header: 'RC Code', key: 'rcCode' },
            { header: 'Routing Code', key: 'routingCode' },
            { header: 'Transaction Date', key: 'transactionDate' },
            { header: 'Updated Date', key: 'updatedAt' },
            { header: 'Customer Name', key: 'name' },
            { header: 'Instrument ID', key: 'instrumentId'},
        ]
    }

    addRow(rows) {
        for (const row of rows) {
           // console.log("row ---> \n ", row)
            this.worksheet.addRow(row);
            // this.worksheet.commit();
           // console.log("row added");
        }
    }

    async commit() {
        this.worksheet.commit();
        try {
            await this.workbook.commit();
        } catch (err) {
            console.log(err);
            throw new Error();
        }
        return { success: true };
    }

}

module.exports = ExcelWriter;
