import { useEffect, useState } from 'react';
import Head from 'next/head'

import { readCsv } from "../services/csv.service";
import Layout from "../components/layout/layout";

import { isTimeInBetween } from '../helpers/time.helper';
import PerformanceSummary from '../components/performance-summary/performance-summary';
import DimensionTableReport from '../components/dimension-table-report/dimension-table-report';

const dashoardTitle = 'ABC Dashboard - Spend Report';

const byCreativeTableMapping = [
    { header: 'Creative', attribute: 'Creative', unit: 'text' },
    { header: 'Spend', attribute: 'Spend', unit: 'currencyWith2Decimals' },
    { header: 'Views', attribute: 'Views', unit: 'number' },
    { header: 'CPV', attribute: 'CPV', unit: 'currencyWith2Decimals' }
];

const byDayRotationTableMapping = [
    { header: 'Day - Rotation', attribute: 'dayRotation', unit: 'text' },
    { header: 'Spend', attribute: 'Spend', unit: 'currencyWith2Decimals' },
    { header: 'Views', attribute: 'Views', unit: 'nunmber' },
    { header: 'CPV', attribute: 'CPV', unit: 'currencyWith2Decimals' }
];

const getMetricSummaries = (spotsData) => {
    const { totalSpend, totalViews } = spotsData.reduce(( acc, item ) => ({
        totalSpend: acc.totalSpend + +item.Spend,
        totalViews: acc.totalViews + +item.Views
    }), {
        totalSpend: 0,
        totalViews: 0
    });

    return [
        {
            title: 'Total Spots',
            total: spotsData.length,
            unit: 'number'
        },
        {
            title: 'Total Spend',
            total: totalSpend,
            unit: 'currency'
        },
        {
            title: 'Total Views',
            total: totalViews,
            unit: 'number'
        }
    ];
};

const getCreativeDimensionReport = (spotsData) => {
    let creativeDimensionData = spotsData.reduce(( acc, item ) => {
        let spend = +item.Spend;
        let views = +item.Views;

        const key = item.Creative;
        if (acc[key]) {
            spend += acc[key].Spend;
            views += acc[key].Views;
        }

        return {
            ...acc,
            [key]: {
                Spend: spend,
                Views: views
            }
        };
    }, {});

    creativeDimensionData = Object.keys(creativeDimensionData).map(( item ) => ({
        ...creativeDimensionData[item],
        Creative: item,
        CPV: creativeDimensionData[item].Spend / creativeDimensionData[item].Views
    }));

    creativeDimensionData.sort(( itemA, itemB ) => {
        const nameA = itemA.Creative.toUpperCase();
        const nameB = itemB.Creative.toUpperCase();

        if (nameA < nameB) {
            return -1;
        } else if (nameA > nameB) {
            return 1;
        } else {
            return 0;
        }
    });

    return creativeDimensionData;
};

const getDayRotationDimensionReport = (rotationsData, spotsData) => {
    const getRotations = (time) => {
        const rotations = rotationsData.filter(( item ) => isTimeInBetween(item.Start, time, item.End));
        return rotations;
    };
    const getRotationSequence = (rotation) => {
        if (rotation.Name === 'Morning') {
            return 0;
        } else if (rotation.Name === 'Afternoon') {
            return 1;
        } else if (rotation.Name === 'Prime') {
            return 2;
        } else {
            return 3;
        }
    }

    let dayRotationDimensionData = spotsData.reduce(( acc, item ) => {
        const rotations = getRotations(item.Time);
        let result = { ...acc };

        rotations.forEach(( rotation ) => {
            let spend = +item.Spend;
            let views = +item.Views;
            const key = `${ item.Date } ${ rotation.Name }`;

            if (acc[key]) {
                spend += acc[key].Spend;
                views += acc[key].Views;
            }

            result = {
                ...result,
                [key]: {
                    Date: item.Date,
                    rotation,
                    sequence: getRotationSequence(rotation),
                    Spend: spend,
                    Views: views
                }
            };
        });

        return result;
    }, {});

    dayRotationDimensionData = Object.keys(dayRotationDimensionData).map(( item ) => ({
        ...dayRotationDimensionData[item],
        dayRotation: `${ dayRotationDimensionData[item].Date } ${ dayRotationDimensionData[item].rotation.Name }`,
        CPV: dayRotationDimensionData[item].Spend / dayRotationDimensionData[item].Views
    }));

    dayRotationDimensionData.sort(( itemA, itemB ) => {
        const dateA = new Date(itemA.Date).getTime();
        const dateB = new Date(itemB.Date).getTime();

        if (dateA < dateB) {
            return -1;
        } else if (dateA > dateB) {
            return 1;
        } else {
            return itemA.sequence - itemB.sequence;
        }
    });

    return dayRotationDimensionData;
};

const Home = ({ rotations, spots }) => {
    const [ metricSummaries, setMetricSummaries ] = useState([]);
    const [ byCreativeData, setByCreativeData ] = useState([]);
    const [ byDayRotationData, setByDayRotationData ] = useState([]);

    useEffect(() => {
        if (rotations && spots) {
            const summaries = getMetricSummaries(spots);
            setMetricSummaries(() => summaries);

            const creativeDimensionData = getCreativeDimensionReport(spots);
            setByCreativeData(() => creativeDimensionData);

            const dayRotationDimensionData = getDayRotationDimensionReport(rotations, spots);
            setByDayRotationData(() => dayRotationDimensionData);
        }
    }, [ rotations, spots ]);

    return (
        <>
            <Head>
                <title>{ dashoardTitle }</title>
            </Head>

            <PerformanceSummary
                metricSummaries={ metricSummaries } />

            <Layout>
                <DimensionTableReport
                    title="By Creative"
                    tableHeaderMapping={ byCreativeTableMapping }
                    tableData={ byCreativeData }
                />

                <DimensionTableReport
                    title="By Day - Rotation"
                    tableHeaderMapping={ byDayRotationTableMapping }
                    tableData={ byDayRotationData }
                />
            </Layout>
        </>
    )
};

export const getStaticProps = async () => {
    const rotations = await readCsv('csv/rotations.csv');
    const spots = await readCsv('csv/spots.csv');

    return {
        props: {
            rotations,
            spots
        }
    };
};

export default Home;
