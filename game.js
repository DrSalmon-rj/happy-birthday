// ==========================================
// game.js - 核心引擎逻辑
// ==========================================

let currentLineIndex = 0;
let isTyping = false;
let typeInterval;
let autoNextTimeout;
let currentDisplayedText = "";

const els = {
    container: document.getElementById('game-container'),
    image: document.getElementById('scene-image'),
    video: document.getElementById('scene-video'),
    name: document.getElementById('speaker-name'),
    text: document.getElementById('dialogue-text'),
    box: document.getElementById('dialogue-box'),
    indicator: document.getElementById('next-indicator'),
    puzzle: document.getElementById('puzzle-container')
};

const CURSOR_HTML = '<span class="typing-cursor"></span>';
const TYPING_SPEED_MS = 120 ;

function renderLine(index) {
    if (index >= scriptData.length) return;
    const line = scriptData[index];

    if (line.autoNext) {
        els.indicator.style.display = 'none';
    } else {
        els.indicator.style.display = 'block';
    }

    clearTimeout(autoNextTimeout);

    // 👇 重点看这里：触发谜题一的代码！
    if (line.action === "START_PUZZLE_1") {
        els.container.classList.add('hidden');
        els.puzzle.classList.remove('hidden');
        startPuzzle1(); // 呼叫 puzzle1.js 里的函数
        return;
    }
    if (line.action === "START_PUZZLE_2") {
        els.container.classList.add('hidden');
        els.puzzle.classList.remove('hidden');
        startPuzzle2(); // 呼叫 puzzle2.js
        return;
    }
    // 👇 (新加这段代码) 👇
    if (line.action === "START_PUZZLE_3") {
        els.container.classList.add('hidden');
        els.puzzle.classList.remove('hidden');
        startPuzzle3(); // 呼叫 puzzle3.js
        return;
    }
    // 👇 (新加这段：游戏大结局逻辑) 👇
    if (line.action === "GAME_END") {
        // 等最后一句台词打字机效果播完后，稍微延迟 0.5 秒再弹窗，体验更自然
        setTimeout(() => {
            // 1. 弹出你指定的特殊提示框
            alert("现实再会");

            // 2. 尝试关闭当前网页窗口
            window.close();

            // 3. 兜底方案：如果浏览器安全机制拦截了关闭窗口，就强行把整个网页涂黑，并显示断开连接，防止穿帮
            document.body.style.background = "#000";
            document.body.innerHTML = `
                <div style="height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: #000; font-family: inherit;">
                    <p style="color: #444; font-size: 1rem; letter-spacing: 4px; animation: blink 2s infinite;">- CONNECTION TERMINATED -</p>
                </div>
            `;
        }, 500);
        return;
    }
    els.name.textContent = line.speaker;

    if (line.video) {
        els.image.classList.add('hidden');
        els.video.classList.remove('hidden');
        if (!els.video.src.endsWith(line.video)) {
            els.video.src = line.video;
        }
    } else if (line.image) {
        els.video.classList.add('hidden');
        els.video.pause();
        els.image.classList.remove('hidden');
        els.image.style.backgroundImage = `url('${line.image}')`;
    }

    if (line.effect === "shake") {
        els.container.classList.add("effect-shake");
        setTimeout(() => els.container.classList.remove("effect-shake"), 400);
    }

    isTyping = true;
    currentDisplayedText = "";
    let charIndex = 0;
    els.text.innerHTML = CURSOR_HTML;

    clearInterval(typeInterval);
    typeInterval = setInterval(() => {
        currentDisplayedText += line.text.charAt(charIndex);
        els.text.innerHTML = currentDisplayedText + CURSOR_HTML;
        charIndex++;

        if (charIndex >= line.text.length) {
            clearInterval(typeInterval);
            isTyping = false;
            els.text.innerHTML = currentDisplayedText;

            if (line.autoNext) {
                autoNextTimeout = setTimeout(() => {
                    currentLineIndex++;
                    renderLine(currentLineIndex);
                }, line.autoNext);
            }
        }
    }, TYPING_SPEED_MS);
}

els.box.addEventListener('click', () => {
    if (isTyping) {
        clearInterval(typeInterval);
        els.text.innerHTML = scriptData[currentLineIndex].text;
        isTyping = false;

        if (scriptData[currentLineIndex].autoNext) {
            clearTimeout(autoNextTimeout);
            autoNextTimeout = setTimeout(() => {
                currentLineIndex++;
                renderLine(currentLineIndex);
            }, scriptData[currentLineIndex].autoNext);
        }
    } else {
        clearTimeout(autoNextTimeout);
        currentLineIndex++;
        renderLine(currentLineIndex);
    }
});

// ==========================================
// 5. 引擎启动逻辑 (点击封面后启动)
// ==========================================
const startScreen = document.getElementById('start-screen');

startScreen.addEventListener('click', () => {
    // 1. 让封面渐隐变透明
    startScreen.style.opacity = '0';

    // 2. 等待 800 毫秒（跟 CSS 里的动画时间一致）后，把封面彻底隐藏，并开始游戏
    setTimeout(() => {
        startScreen.style.display = 'none';

        // 真正开始跑第一句剧本！
        renderLine(currentLineIndex);
    }, 800);
});