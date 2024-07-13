init();

const observer = new MutationObserver(function () {
    init();
});
observer.observe(document, { childList: true, subtree: true });

function init() {
    setVideoPlaybackRate();
    bindEvents();
}

async function bindEvents() {
    const speedMenu = await getElement('.ytp-panel-menu');
    if (!speedMenu || speedMenu.hasBoundEvents) {
        return;
    }

    Array.from(speedMenu.querySelectorAll('.ytp-menuitem')).forEach((node) => {
        node.addEventListener('click', () => {
            const speed = parseFloat(node.textContent.trim());
            localStorage.setItem('videoPlaybackRate_youtube', speed);
            setVideoPlaybackRate();
        });
    });

    speedMenu.hasBoundEvents = true;
}

/**
 * 获取某个元素
 *
 * @param {string} selector 选择器
 * @returns
 */
function getElement(selector) {
    let btnContainer;
    let resolveFn;

    const updateBtnContainer = () => {
        btnContainer = document.querySelector(selector);
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

function setVideoPlaybackRate(
    speed = localStorage.getItem('videoPlaybackRate_youtube')
) {
    if (!speed) return; // 如果没有存储的速度值，则直接返回

    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
        video.playbackRate = parseFloat(speed); // 确保速度值为数值类型
    });
}
