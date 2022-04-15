
class Animation {

    toggleDivHorizontal(id, t, open, close) {
        let el = document.getElementById(id);
        let width = t ? open : close;
        el.style.transition = 'all 800ms';
        el.style.width = width + 'px';
    }
    
    toggleDivVertical(id, t, open, close) {
        let el = document.getElementById(id);
        let width = t ? open : close;
        el.style.transition = 'all 800ms';
        el.style.width = width + 'px';
    }
}

export default new Animation();