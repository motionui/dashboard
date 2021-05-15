import cn from 'classnames';

import { formatMetricData } from '../../helpers/metric-data.helper';
import styles from './dimension-table-report.module.css';

const cellPadding = '24';

const DimensionTableReport = ({ title, tableHeaderMapping, tableData }) => {
    return (
        <section className={ styles.dimension }>
            <h2 className={ styles.title }>{ title }</h2>
            <table className={ styles.table } cellPadding={ cellPadding }>
                <thead>
                    <tr>
                        {
                            tableHeaderMapping.map((item) => (
                                <th
                                    key={ item.header }
                                    className={ cn({
                                        [styles.header]: true,
                                        [styles.left]: item.unit === 'text',
                                        [styles.right]: item.unit !== 'text'
                                    }) }
                                >
                                    { item.header }
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        tableData.map((row, index) => (
                            <tr key={ index }>
                                {
                                    tableHeaderMapping.map((item) => (
                                        <td
                                            key={ item.attribute }
                                            className={ cn({
                                                [styles.data]: true,
                                                [styles.left]: item.unit === 'text',
                                                [styles.right]: item.unit !== 'text',
                                                [styles.uppercase]: item.attribute === 'dayRotation'
                                            }) }
                                        >
                                            { formatMetricData(row[item.attribute], item.unit ) }
                                        </td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </section>
    )
};

export default DimensionTableReport;
