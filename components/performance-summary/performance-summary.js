import MetricSummary from '../metric-summary/metric-summary';
import styles from './performance-summary.module.css';

const PerformanceSummary = ({ metricSummaries }) => {
    return (
        <section className={ styles.summary }>
            {
                metricSummaries.map((metric) => (
                    <MetricSummary key={ metric.title } { ...metric } />
                ))
            }
        </section>
    )
}

export default PerformanceSummary;
