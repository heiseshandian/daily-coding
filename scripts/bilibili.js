addBtns();

const observer = new MutationObserver(function () {
    addBtns();
});
observer.observe(document, { childList: true, subtree: true });

function addBtns() {
    addChangeSpeedBtn();
    setVideoPlaybackRate(); // 确保视频播放速度被设置
}

const CHANGE_SPEED = '倍速';

async function addChangeSpeedBtn() {
    const btnContainer = await getBtnContainer();
    if (btnContainer.hasAddedChangeSpeedBtn) {
        return;
    }

    const btn = document.createElement('div');
    btn.textContent = CHANGE_SPEED;
    btn.classList.add('bpx-player-ctrl-btn');
    btn.classList.add('change-speed-btn');

    const speedListContainer = document.createElement('div');
    speedListContainer.classList.add('speed-list-container');
    speedListContainer.classList.add('bpx-player-ctrl-playbackrate-menu');

    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2.0];
    speeds.forEach((speed) => {
        const speedOption = document.createElement('div');
        speedOption.textContent = `${speed}`;
        speedOption.classList.add('speed-option');
        speedOption.classList.add('bpx-player-ctrl-playbackrate-menu-item');
        speedOption.onclick = function () {
            localStorage.setItem('videoPlaybackRate', speed);
            setVideoPlaybackRate(speed); // 更新视频播放速度
            speedListContainer.style.display = 'none';
        };
        speedListContainer.appendChild(speedOption);
    });

    btn.onmouseover = function () {
        // 直接显示speedListContainer，无需再动态计算位置
        speedListContainer.style.display = 'block';
    };

    speedListContainer.onmouseleave = function (event) {
        if (
            !btn.contains(event.relatedTarget) &&
            !speedListContainer.contains(event.relatedTarget)
        ) {
            speedListContainer.style.display = 'none';
        }
    };

    btn.appendChild(speedListContainer);
    btnContainer.appendChild(btn);
    btnContainer.hasAddedChangeSpeedBtn = true;
}

function getBtnContainer(
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

function setVideoPlaybackRate(
    speed = localStorage.getItem('videoPlaybackRate')
) {
    if (!speed) return; // 如果没有存储的速度值，则直接返回

    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
        video.playbackRate = parseFloat(speed); // 确保速度值为数值类型
    });
}
