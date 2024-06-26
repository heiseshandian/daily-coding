// https://docs.google.com/forms/d/18vELOnj1c1ID6OaPH6QMuW75WyYkrtqSIBVbG3wajAw/viewform?edit_requested=true
// leetcode 表单助手
addAutoFillBtn();

function addAutoFillBtn() {
    const btn = document.createElement('button');
    btn.textContent = 'auto fill';
    btn.classList.add('auto-fill-btn');
    btn.addEventListener('click', handleClickAutoFillBtn);

    document.body.appendChild(btn);
}

function handleClickAutoFillBtn() {
    const inputs = document.querySelectorAll('input[type=text]');
    const vals = [
        'heiseshandian',
        'baymax8429',
        'China',
        'Be good at solving dp problems',
    ];

    Array.from(inputs).forEach((input, i) => {
        simulateInput(input, vals[i]);
    });
}

function simulateInput(element, text) {
    element.focus(); // 聚焦到输入框
    element.value = ''; // 清空输入框的值

    for (let i = 0; i < text.length; i++) {
        let event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        element.value += text[i]; // 将每个字符逐个添加到输入框
        element.dispatchEvent(event); // 触发 input 事件
    }

    // 可选：触发 change 事件，以便处理输入完成后的逻辑
    let changeEvent = new Event('change', {
        bubbles: true,
        cancelable: true,
    });
    element.dispatchEvent(changeEvent);
}
