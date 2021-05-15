import fs from 'fs';
import csvParser from 'csv-parser';

export const readCsv = (csvFile) => {
    return new Promise((resolve) => {
        const results = [];

        fs.createReadStream(csvFile).pipe(csvParser())
            .on('data',(data) => results.push(data))
            .on('end', () => resolve(results));
    });
};
