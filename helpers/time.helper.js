export const isTimeInBetween = (startTime, timeToCheck, endTime) => {
    const anyDay = '2020-12-25';
    const start = new Date(`${ anyDay } ${ startTime }`).getTime();
    const end = new Date(`${ anyDay } ${ endTime }`).getTime();
    const time = new Date(`${ anyDay } ${ timeToCheck }`).getTime();

    return start <= time && time <= end;
};
