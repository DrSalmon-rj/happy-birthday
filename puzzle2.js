// ==========================================
// puzzle2.js - 谜题二 (思维保护机制：图片密码 + 音频)
// ==========================================

function startPuzzle2() {
    const puzzleEl = els.puzzle;
    const CORRECT_PASSWORD = "0623"; // ⭐️ 这里设置你的正确 4 位密码

    // 1. 动态生成界面 HTML
    const p2HTML = `
        <div id="p2-chapter" style="height: 100vh; cursor: pointer; background-image: url('img/c2.gif'); background-size: cover; background-position: center; position: relative;">
            <div style="position: absolute; bottom: 33%; left: 50%; transform: translateX(-50%); font-size: 1.2rem; color: #eee; letter-spacing: 4px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); animation: blink 1.5s infinite;">
                - 点击进入 -
            </div>
        </div>

        <div id="p2-password-screen" style="display: none; height: 100vh; flex-direction: column; background: #050505;">
            <div style="flex: 1; display: flex; justify-content: center; align-items: center; padding: 20px;">
                <img src="img/hint2.jpg" alt="线索提示" style="max-width: 90%; max-height: 100%; border: 1px solid #333; box-shadow: 0 0 15px rgba(0,255,234,0.1);">
            </div>
            
            <div style="height: 40vh; display: flex; flex-direction: column; justify-content: center; align-items: center; border-top: 1px dashed #333; background: #0a0a0a;">
                <p style="color: #00ffea; margin-bottom: 20px; letter-spacing: 2px;">请输入 4 位终端校验码</p>
                <div style="display: flex; gap: 10px; margin-bottom: 25px;">
                    <input type="text" id="p2-input" maxlength="4" placeholder="----" autocomplete="off" style="width: 150px; padding: 15px; font-size: 1.5rem; text-align: center; font-family: inherit; background: rgba(0,255,234,0.05); border: 1px solid #00ffea; color: #fff; outline: none; letter-spacing: 8px;">
                </div>
                <button id="p2-submit-btn" style="padding: 12px 40px; font-size: 1.1rem; background: #00ffea; border: none; color: #000; font-weight: bold; cursor: pointer; transition: 0.2s;">
                    验证密钥
                </button>
            </div>
        </div>

        <div id="p2-audio-screen" style="display: none; height: 100vh; flex-direction: column; justify-content: center; align-items: center; background: #050505;">
            <p style="color: #0f0; margin-bottom: 30px; letter-spacing: 2px;">✓ 权限已确认，解密音频已就绪</p>
            <button id="p2-play-btn" style="padding: 15px 40px; font-size: 1.2rem; background: transparent; border: 1px solid #00ffea; color: #00ffea; cursor: pointer; margin-bottom: 15px;">
                ▶ 点击播放
            </button>
            <p id="p2-hint" style="color: #555; font-size: 0.85rem; letter-spacing: 1px;">( 播放完成后可继续 )</p>
            
            <button id="p2-continue-btn" style="display: none; margin-top: 40px; padding: 12px 30px; font-size: 1rem; background: rgba(0,255,234,0.1); border: 1px solid #00ffea; color: #00ffea; cursor: pointer;">
                >> 返回现实
            </button>
        </div>
    `;

    puzzleEl.innerHTML = p2HTML;

    // 2. 获取 DOM 元素
    const chapterScreen = document.getElementById('p2-chapter');
    const passwordScreen = document.getElementById('p2-password-screen');
    const inputField = document.getElementById('p2-input');
    const submitBtn = document.getElementById('p2-submit-btn');

    const audioScreen = document.getElementById('p2-audio-screen');
    const playBtn = document.getElementById('p2-play-btn');
    const continueBtn = document.getElementById('p2-continue-btn');
    const hintText = document.getElementById('p2-hint');

    // 配置第二段音频
    const audio2 = new Audio('audio/2.m4a');

    // 3. 逻辑：点击封面 -> 弹 Alert -> 进入密码界面
    chapterScreen.addEventListener('click', () => {
        chapterScreen.style.display = 'none';

        // 浏览器原生的提示框，符合“系统拦截”的设定
        alert("⚠️ 警告：思维保护机制被激活，需要：“钥匙”！");

        passwordScreen.style.display = 'flex';
        inputField.focus(); // 自动聚焦输入框
    });

    // 4. 逻辑：密码验证
    submitBtn.addEventListener('click', () => {
        if (inputField.value === CORRECT_PASSWORD) {
            // 密码正确，进入音频界面
            passwordScreen.style.display = 'none';
            audioScreen.style.display = 'flex';
        } else {
            // 密码错误，震动反馈
            inputField.style.background = "rgba(255, 0, 0, 0.2)";
            inputField.style.borderColor = "#f00";
            passwordScreen.classList.add('effect-shake');

            setTimeout(() => {
                inputField.style.background = "rgba(0,255,234,0.05)";
                inputField.style.borderColor = "#00ffea";
                inputField.value = ""; // 清空错误输入
                passwordScreen.classList.remove('effect-shake');
            }, 500);
        }
    });

    // 5. 逻辑：音频播放
    playBtn.addEventListener('click', () => {
        playBtn.disabled = true;
        playBtn.textContent = "思维片段解析中...";
        playBtn.style.borderColor = "#333";
        playBtn.style.color = "#888";
        audio2.play().catch(e => alert("⚠️ 播放失败，请检查 audio/clue2.mp3"));
    });

    audio2.addEventListener('ended', () => {
        playBtn.textContent = "解析完成";
        hintText.style.display = 'none';
        continueBtn.style.display = 'block'; // 播放完毕，显示继续按钮
    });

    // 6. 逻辑：点击继续，返回主剧情
    continueBtn.addEventListener('click', () => {
        puzzleEl.classList.add('hidden');
        puzzleEl.innerHTML = '';
        els.container.classList.remove('hidden');

        currentLineIndex++;
        renderLine(currentLineIndex); // 交接给主剧情引擎
    });
}