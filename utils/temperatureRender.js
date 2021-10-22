export default function TempRender (tmp) {
    if (tmp == null || tmp == 0 || isNaN(tmp) ) return '--';
    return (tmp * 0.001).toFixed(1) + '°C';
}