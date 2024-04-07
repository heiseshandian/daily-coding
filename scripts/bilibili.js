init();

const observer = new MutationObserver(function () {
    init();
});
observer.observe(document, { childList: true, subtree: true });

function init() {
    setVideoPlaybackRate();
    bindEvents();
}

function getElement(
    selectors = '#bilibili-player .bpx-player-control-bottom-center'
) {
    let btnContainer;
    let resolveFn;

    const updateBtnContainer = () => {
        btnContainer = document.querySelector(selectors);
        if (!btnContainer) {
            requestAnimationFrame(updateBtnContainer);
        } else {
            resolveFn(btnContainer);
        }
    };

    return new Promise((resolve) => {
        resolveFn = resolve;
        updateBtnContainer();
    });
}

async function bindEvents() {
    const speedMenu = await getElement(
        '#bilibili-player .bpx-player-ctrl-playbackrate-menu'
    );
    if (!speedMenu || speedMenu.hasBoundEvents) {
        return;
    }

    Array.from(
        speedMenu.querySelectorAll('.bpx-player-ctrl-playbackrate-menu-item')
    ).forEach((node) => {
        node.addEventListener('click', () => {
            const speed = parseFloat(node.textContent.trim());
            localStorage.setItem('videoPlaybackRate', speed);
            setVideoPlaybackRate();
        });
    });

    speedMenu.hasBoundEvents = true;
}

function setVideoPlaybackRate(
    speed = localStorage.getItem('videoPlaybackRate')
) {
    if (!speed) return; // 如果没有存储的速度值，则直接返回

    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
        video.playbackRate = parseFloat(speed); // 确保速度值为数值类型
    });
}
