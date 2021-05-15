export const formatMetricData = (value, unit) => {
    let formatted = value;

    switch (unit) {
        case 'number': {
            formatted = new Intl.NumberFormat('en-US').format(value);
            break;
        }
        case 'currency': {
            formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 2,
            }).format(value).replace(/\.00$/, '');
            break;
        }
        case 'currencyWith2Decimals': {
            formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 2,
            }).format(value);
            break;
        }
        case 'text':
        default: {
            break;
        }
    }

    return formatted;
};
