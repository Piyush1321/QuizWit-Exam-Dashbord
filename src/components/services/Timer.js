import TimeToString from "./TimeToString";

class Timer {
    constructor() {
        this.time = 0;
        this.element = null;
        this.control = true;
        this.callback = null;
        this.label = false;
        this.message = '';
        this.remove = false;
    }
    set(time, id, callback) {
        this.time = time;
        this.element = document.getElementById(id);
        this.callback = callback;
    }
    setRemove() {
        this.remove = true;
    }
    setMessage(msg) {
        this.message = msg;
    }
    labelView() {
        this.label = true;
    }

    start(type = 'COUNT_DOWN') {
        this.control = true;

        setTimeout(() => {
            if(type == 'COUNT_DOWN')
                this.countDown();
            else this.countUp();
        }, 1000);

    }

    format() {
        let hours = parseInt(this.time / 3600);
        let timeLeft = this.time - hours * 3600;
        let minutes = parseInt(timeLeft / 60);
        timeLeft = timeLeft - minutes * 60;
        let seconds = timeLeft;
    
        hours = hours.toString();
        minutes = minutes.toString();
        seconds = seconds.toString();
    
        if (hours.length == 1)
            hours = '0' + hours;
        if (minutes.length == 1)
            minutes = '0' + minutes;
        if (seconds.length == 1)
            seconds = '0' + seconds;
        
        return hours + ':' + minutes + ':' + seconds;
    }

    setCountUpLimit(limit) {
        this.countUpLimit = limit; 
    }

    countDown() {
        if(!this.control)
            return;
        let timerblock = this.element;
        if(this.label)
            timerblock.innerHTML = (new TimeToString(this.time).convert());
        else timerblock.innerHTML = this.format();
        timerblock.style.display = 'flex';

        if (this.time <= 59) {
            timerblock.style.color = 'rgb(227 80 80)';
        }
    
        if (this.time <= 0) {
            if(this.remove)
                timerblock.remove();
            else timerblock.innerHTML = this.message;
            this.callback();
            this.stop();
        }
        else {
            setTimeout(() => {
                this.countDown();
            }, 1000);
            this.time--;
        }
    }

    countUp() {
        if(!this.control)
            return;
        let timerblock = this.element;
        if(this.label)
            timerblock.innerHTML = (new TimeToString(this.time).convert());
        else timerblock.innerHTML = this.format();
        timerblock.style.display = 'flex';
    
        if(this.countUpLimit <= this.time) {
            if(this.remove)
                timerblock.remove();
            else timerblock.innerHTML = this.message;
            this.callback();
            this.stop();
        }
        else {
            setTimeout(() => {
                this.countUp();
            }, 1000);
            this.time++;
        }

    }

    stop() {
        this.control = false;
    }
}

export default Timer;