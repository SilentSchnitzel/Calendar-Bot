//convert strings like "8:00" and "22:00" to something of type date
function convertTimeStringToDate(timeString) {
    var date = new Date();
    //splits the string into the hour and minute part
    var timeComponents = timeString.split(':');
    var hours = parseInt(timeComponents[0], 10);
    var minutes = parseInt(timeComponents[1], 10);
    // Set the hours and minutes of the date object
    date.setHours(hours);
    date.setMinutes(minutes);

    //checks to see if the date is valid
    const validity = isNaN(date);
    if (validity == true) {
        return [null, null];
    }
    if (hours > 23) {
        return [null, null];
    }
    if (minutes > 59) {
        return [null, null];
    }
    return [hours, minutes];
}

module.exports = convertTimeStringToDate