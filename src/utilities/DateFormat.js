function MonthConverter(monthId){
    const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return names[monthId - 1];
}

export function dateFormat(date){
    const [year, month, day] = date.split("-");
    return `${MonthConverter(month)} ${day}, ${year}` ;
}

export default dateFormat;