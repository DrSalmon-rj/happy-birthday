// ==========================================
// puzzle1.js - 谜题一 (听力选择 + 碎片重组)
// ==========================================

function startPuzzle1() {
    const puzzleEl = els.puzzle;

    // ------------------------------------------
    // 阶段一：音频选择题的 HTML 模板
    // ------------------------------------------
    const audioHTML = `
        <div id="p1-chapter" style="height: 100vh; cursor: pointer; background-image: url('img/c1.gif'); background-size: cover; background-position: center; position: relative;">
            <div style="position: absolute; bottom: 33%; left: 50%; transform: translateX(-50%); font-size: 1.2rem; color: #eee; letter-spacing: 4px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); animation: blink 1.5s infinite;">
                - 点击进入 -
            </div>
        </div>

        <div id="p1-audio-screen" style="display: none; height: 100vh; flex-direction: column; justify-content: center; align-items: center; background: #050505;">
            <button id="p1-play-btn" style="padding: 15px 40px; font-size: 1.2rem; background: transparent; border: 1px solid #00ffea; color: #00ffea; cursor: pointer; margin-bottom: 15px; transition: all 0.3s;">
                ▶ 点击播放
            </button>
            <p id="p1-hint" style="color: #555; font-size: 0.85rem; letter-spacing: 1px;">( 建议戴上耳机，调高音量 )</p>
            
            <div id="p1-options" style="display: none; margin-top: 50px; flex-direction: column; gap: 15px; width: 85%; max-width: 320px;">
                <button class="p1-opt" data-correct="false" style="padding: 12px; background: rgba(0,255,234,0.05); border: 1px solid #333; color: #ccc; cursor: pointer; text-align: left;">包图连楼</button>
                <button class="p1-opt" data-correct="true" style="padding: 12px; background: rgba(0,255,234,0.05); border: 1px solid #333; color: #ccc; cursor: pointer; text-align: left;">学生创新中心c楼</button>
                <button class="p1-opt" data-correct="false" style="padding: 12px; background: rgba(0,255,234,0.05); border: 1px solid #333; color: #ccc; cursor: pointer; text-align: left;">罗森便利店</button>
                <button class="p1-opt" data-correct="false" style="padding: 12px; background: rgba(0,255,234,0.05); border: 1px solid #333; color: #ccc; cursor: pointer; text-align: left;">西18宿舍楼</button>
            </div>
        </div>
    `;

    puzzleEl.innerHTML = audioHTML;

    const chapterScreen = document.getElementById('p1-chapter');
    const audioScreen = document.getElementById('p1-audio-screen');
    const playBtn = document.getElementById('p1-play-btn');
    const hintText = document.getElementById('p1-hint');
    const optionsContainer = document.getElementById('p1-options');
    const optionBtns = document.querySelectorAll('.p1-opt');
    const audio = new Audio('audio/1.m4a');

    chapterScreen.addEventListener('click', () => {
        chapterScreen.style.display = 'none';
        audioScreen.style.display = 'flex';
    });

    playBtn.addEventListener('click', () => {
        playBtn.disabled = true;
        playBtn.textContent = "思维片段解析中...";
        playBtn.style.borderColor = "#333";
        playBtn.style.color = "#888";
        audio.play().catch(e => {
            alert("⚠️ 播放失败，请检查文件");
        });
    });

    audio.addEventListener('ended', () => {
        playBtn.textContent = "解析完成";
        hintText.style.display = 'none';
        optionsContainer.style.display = 'flex';
    });

    optionBtns.forEach(btn => {
        btn.addEventListener('mouseover', () => {
            if (btn.style.borderColor === 'rgb(51, 51, 51)' || btn.style.borderColor === '#333') btn.style.borderColor = "#00ffea";
        });
        btn.addEventListener('mouseout', () => {
            if (btn.style.borderColor === 'rgb(0, 255, 234)' || btn.style.borderColor === '#00ffea') btn.style.borderColor = "#333";
        });

        btn.addEventListener('click', () => {
            if (btn.dataset.correct === "true") {
                btn.style.background = "rgba(0, 255, 0, 0.2)";
                btn.style.borderColor = "#0f0";
                setTimeout(() => {
                    // ⭐️ 选择正确后，不弹窗，直接启动第二阶段拼图！
                    startJigsawPhase();
                }, 800);
            } else {
                btn.style.background = "rgba(255, 0, 0, 0.2)";
                btn.style.borderColor = "#f00";
                audioScreen.classList.add('effect-shake');
                setTimeout(() => {
                    btn.style.background = "rgba(0,255,234,0.05)";
                    btn.style.borderColor = "#333";
                    audioScreen.classList.remove('effect-shake');
                }, 500);
            }
        });
    });

    // ------------------------------------------
    // 阶段二：碎片重组拼图的核心逻辑
    // ------------------------------------------
    function startJigsawPhase() {
        // 构建拼图界面的专属样式和 HTML
        const jigsawHTML = `
            <style>
                #jigsaw-container { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; min-height: 100vh; background: #050505; padding-top: 5vh; box-sizing: border-box; }
                
                /* 标题增加了操作提示 */
                #jigsaw-title { color: #00ffea; letter-spacing: 1px; margin-bottom: 20px; font-weight: normal; font-size: 1.1rem; text-align: center; width: 90%; }
                
                .jigsaw-layout { display: flex; flex-direction: column; gap: 20px; align-items: center; }
                #pieces-tray { width: 336px; min-height: 200px; background: rgba(0,255,234,0.05); border: 1px dashed #00ffea; display: flex; flex-wrap: wrap; gap: 4px; padding: 6px; align-content: flex-start; box-sizing: border-box; }
                #puzzle-board { width: 336px; height: 336px; border: 2px solid #333; display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, 1fr); background: #111; gap: 0; box-sizing: border-box; }
                
                .jigsaw-slot { width: 84px; height: 84px; border: 1px solid #222; box-sizing: border-box; display: flex; justify-content: center; align-items: center; cursor: pointer; }
                .jigsaw-piece { width: 82px; height: 82px; cursor: pointer; background-image: url('img/jigsaw.jpg'); background-size: 328px 328px; transition: transform 0.2s, border 0.2s, box-shadow 0.2s; box-sizing: border-box; }
                
                /* ⭐️ 核心：选中状态的特效，让玩家知道点中了哪一块 */
                .jigsaw-piece.selected { transform: scale(0.9); border: 3px solid #0f0; box-shadow: 0 0 15px rgba(0,255,0,0.8); z-index: 10; }
            </style>

            <div id="jigsaw-container">
                <h2 id="jigsaw-title">WARNING: 空间坐标已破碎<br><span style="font-size:0.8rem; color:#aaa;">(先点击选中碎片，再点击空位放置)</span></h2>
                <div class="jigsaw-layout">
                    <div id="puzzle-board"></div>
                    <div id="pieces-tray"></div>
                </div>
            </div>
        `;

        puzzleEl.innerHTML = jigsawHTML;

        const board = document.getElementById('puzzle-board');
        const tray = document.getElementById('pieces-tray');

        let selectedPiece = null; // 记录当前手指点中的碎片

        // 1. 生成 16 个底座插槽
        for (let i = 0; i < 16; i++) {
            let slot = document.createElement('div');
            slot.className = 'jigsaw-slot';
            slot.dataset.targetIndex = i;

            // 交互逻辑：点击插槽来放置选中的碎片
            slot.addEventListener('click', () => {
                if (selectedPiece) {
                    // 如果格子里已经有别的碎片了，把旧的挤回托盘
                    if (slot.children.length > 0) {
                        tray.appendChild(slot.children[0]);
                    }
                    slot.appendChild(selectedPiece);
                    // 放置后取消发光状态
                    selectedPiece.classList.remove('selected');
                    selectedPiece = null;
                    checkWinCondition();
                }
            });
            board.appendChild(slot);
        }

        // 交互逻辑：点一下托盘的空白处，可以把拿在手里的碎片放回去
        tray.addEventListener('click', (e) => {
            if (selectedPiece && e.target === tray) {
                tray.appendChild(selectedPiece);
                selectedPiece.classList.remove('selected');
                selectedPiece = null;
            }
        });

        // 2. 生成 16 个图片碎片
        let pieces = [];
        for (let i = 0; i < 16; i++) {
            let piece = document.createElement('div');
            piece.className = 'jigsaw-piece';
            piece.dataset.index = i;

            let col = i % 4;
            let row = Math.floor(i / 4);
            piece.style.backgroundPosition = `-${col * 82}px -${row * 82}px`;

            // 交互逻辑：点击碎片本身
            piece.addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止点击事件穿透到底下的槽位

                if (selectedPiece === piece) {
                    // 如果点的就是当前发光的，就取消选中
                    piece.classList.remove('selected');
                    selectedPiece = null;
                } else {
                    // 如果手里已经拿着别的碎片，先让别的碎片暗下去
                    if (selectedPiece) {
                        selectedPiece.classList.remove('selected');
                    }
                    // 让当前点中的这块碎片发光变小
                    piece.classList.add('selected');
                    selectedPiece = piece;
                }
            });

            pieces.push(piece);
        }

        // 3. 把碎片打乱放入托盘
        pieces.sort(() => Math.random() - 0.5);
        pieces.forEach(p => tray.appendChild(p));

        // 4. 胜利条件检测
        function checkWinCondition() {
            const slots = document.querySelectorAll('.jigsaw-slot');
            let isWin = true;

            slots.forEach(slot => {
                if (slot.children.length === 0 || slot.children[0].dataset.index !== slot.dataset.targetIndex) {
                    isWin = false;
                }
            });

            if (isWin) {
                setTimeout(() => {
                    const title = document.getElementById('jigsaw-title');
                    title.innerHTML = "坐标重组成功！即将跃迁...";
                    title.style.color = "#0f0";
                    setTimeout(() => {
                        els.puzzle.classList.add('hidden');
                        els.puzzle.innerHTML = '';
                        els.container.classList.remove('hidden');

                        currentLineIndex++;
                        renderLine(currentLineIndex);
                    }, 1500);
                }, 300);
            }
        }
    }
}