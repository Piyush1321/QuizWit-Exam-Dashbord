class Button {
    processing(id, text) {
        let btn = document.getElementById(id);
        btn.disabled = true;
        let icon = '<i class="fas fa-sync-alt fa-spin mr-5"></i>';
        btn.innerHTML = icon + text;
    }

    reset(id, text) {
        let btn = document.getElementById(id);
        btn.innerHTML = text;
        btn.disabled = false;
    }
}

export default new Button();