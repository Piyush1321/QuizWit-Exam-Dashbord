class TimeToString {

    constructor(time) {
        this.time = time;
    }
    
    convert = () => {
        if(this.time <= 0)
            return '-';
        let value = '';
        let hours = parseInt(this.time/3600);
        let leftSeconds = this.time%3600;
        let minutes = parseInt(leftSeconds/60);
        leftSeconds = leftSeconds%60;

        let seconds = leftSeconds;

        if(hours > 0) {
            if(hours == 1)
                value += "1 hr ";
            else value += hours + " hrs "
        }

        if(minutes > 0) {
            if(minutes == 1)
                value += "1 min ";
            else value += minutes + " mins ";
        }

        if(seconds > 0) {
            if(seconds == 1)
                value += "1 sec";
            else value += seconds + " secs";
        }

        return value;
    }
}

export default TimeToString;