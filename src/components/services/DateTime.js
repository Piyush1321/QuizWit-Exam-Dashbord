class DateTime {

    constructor(timestamp) {
        this.timestamp = timestamp;
    }

    convert() {
        let parts = this.timestamp.split(', ');
        let date = parts[0];
        let time = parts[1];
        console.log(date);
        let dateParts = date.split('/');
        let dd = dateParts[0];
        let mm = dateParts[1];
        let yyyy = dateParts[2];

        date = yyyy + '-' + mm + '-' + dd;
        this.timestamp = date + 'T' + time;
        return this.timestamp;

    }

    convertToView() {
        const date = new Date(this.timestamp);
        return date.toLocaleString();
    }

}

export default DateTime;