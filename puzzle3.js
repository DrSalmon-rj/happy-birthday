// ==========================================
// puzzle3.js - 谜题三 (动图封面 + 录音播放)
// ==========================================

function startPuzzle3() {
    const puzzleEl = els.puzzle;

    // 1. 动态生成界面 HTML
    const p3HTML = `
        <div id="p3-chapter" style="height: 100vh; cursor: pointer; background-image: url('img/c3.gif'); background-size: cover; background-position: center; position: relative; background-color: #050505;">
            <div style="position: absolute; bottom: 33%; left: 50%; transform: translateX(-50%); font-size: 1.2rem; color: #eee; letter-spacing: 4px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); animation: blink 1.5s infinite;">
                - 点击进入 -
            </div>
        </div>

        <div id="p3-audio-screen" style="display: none; height: 100vh; flex-direction: column; justify-content: center; align-items: center; background: #050505; background-image: url('img/puzzle3_bg.jpg'); background-size: cover; background-position: center;">
            
            <div style="background: rgba(0, 0, 0, 0.8); padding: 50px 40px; border: 1px solid #333; border-radius: 4px; text-align: center; backdrop-filter: blur(4px);">
                <p style="color: #00ffea; margin-bottom: 30px; letter-spacing: 2px;">未知源音频已解密</p>
                
                <button id="p3-play-btn" style="padding: 15px 40px; font-size: 1.2rem; background: transparent; border: 1px solid #00ffea; color: #00ffea; cursor: pointer; margin-bottom: 20px; transition: all 0.3s;">
                    ▶ 点击播放
                </button>
                
                <p id="p3-hint" style="color: #666; font-size: 0.9rem; letter-spacing: 1px;">( 滋滋... 信号干扰严重... )</p>
                
                <button id="p3-continue-btn" style="display: none; margin-top: 20px; padding: 12px 30px; font-size: 1rem; background: rgba(0,255,234,0.1); border: 1px solid #00ffea; color: #00ffea; cursor: pointer; margin-left: auto; margin-right: auto;">
                    >> 返回现实
                </button>
            </div>
        </div>
    `;

    // 将界面放入容器
    puzzleEl.innerHTML = p3HTML;

    // 2. 获取 DOM 元素
    const chapterScreen = document.getElementById('p3-chapter');
    const audioScreen = document.getElementById('p3-audio-screen');
    const playBtn = document.getElementById('p3-play-btn');
    const continueBtn = document.getElementById('p3-continue-btn');
    const hintText = document.getElementById('p3-hint');

    // 3. 配置音频
    const audio3 = new Audio('audio/3.m4a');

    // 4. 逻辑：点击封面 -> 进入播放页
    chapterScreen.addEventListener('click', () => {
        chapterScreen.style.display = 'none';
        audioScreen.style.display = 'flex';
    });

    // 5. 逻辑：点击播放录音
    playBtn.addEventListener('click', () => {
        playBtn.disabled = true;
        playBtn.textContent = "思维片段解析中...";
        playBtn.style.borderColor = "#333";
        playBtn.style.color = "#888";

        audio3.play().catch(e => {
            alert("⚠️ 播放失败，请检查 audio/3.m4a 是否存在！");
            console.error(e);
        });
    });

    // 6. 逻辑：音频播放完毕
    audio3.addEventListener('ended', () => {
        playBtn.textContent = "播放完毕";
        hintText.style.display = 'none';
        continueBtn.style.display = 'block';
    });

    // 7. 逻辑：点击返回剧情
    continueBtn.addEventListener('click', () => {
        puzzleEl.classList.add('hidden');
        puzzleEl.innerHTML = '';
        els.container.classList.remove('hidden');

        currentLineIndex++;
        renderLine(currentLineIndex);
    });
}