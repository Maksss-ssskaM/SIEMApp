export const formatIncidentDate = (dateString: string) => {
    const timeZoneOffset = parseInt(process.env.REACT_APP_TIME_ZONE_OFFSET || '0') * 3600000;
    const date = new Date(dateString);
    const localDate = new Date(date.getTime() + timeZoneOffset);

    const pad = (num: number) => (num < 10 ? `0${num}` : num);

    return `${pad(localDate.getDate())}.${pad(localDate.getMonth() + 1)}.${localDate.getFullYear()} ` +
        `(${pad(localDate.getHours())}:${pad(localDate.getMinutes())}:${pad(localDate.getSeconds())})`;
};