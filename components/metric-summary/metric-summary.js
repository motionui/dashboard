import { formatMetricData } from "../../helpers/metric-data.helper";
import styles from './metric-summary.module.css';

const MetricSummary = ({ title, total, unit }) => {
    return (
        <header className={ styles.summary }>
            <h2 className={ styles.title }>{ title }</h2>
            <span className={ styles.metric }>{ formatMetricData(total, unit) }</span>
        </header>
    )
}

export default MetricSummary;
