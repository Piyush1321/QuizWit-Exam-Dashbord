import Animation from "./Animation";

class Flash {
    message(msg, bg) {
        let parent = document.createElement('div');
        let id = 'fm-' + parseInt(Math.pow(10, 15)*Math.random());
        parent.id = id;
        parent.className = 'flash-message ' + bg;
        let child = document.createElement('div');
        child.className = 'flex-row ai-c';
        parent.appendChild(child);
        let msgBlock = document.createElement('div');
        msgBlock.className = 'flex-full';
        msgBlock.innerHTML = msg;
        child.appendChild(msgBlock);

        let iconContainer = document.createElement('div');
        iconContainer.className = 'close-flash-message';
        let closeIcon = document.createElement('i');
        closeIcon.className = 'fas fa-times';
        iconContainer.appendChild(closeIcon);
        iconContainer.addEventListener('click', () => {
            parent.remove();
        })
        child.appendChild(iconContainer);

        document.body.appendChild(parent);

        setTimeout(() => {
            parent.remove();
        }, 10000);
    }
}

export default new Flash();
