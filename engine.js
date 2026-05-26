document.addEventListener("DOMContentLoaded", () => {
    let scenes = {};
    let unlockedLevel = 1;

    const SAVED_LEVEL = localStorage.getItem("vn_progress");
if (SAVED_LEVEL) {
    unlockedLevel = parseInt(SAVED_LEVEL);
}
    const menuScreen = document.getElementById("menu");
    const levelScreen = document.getElementById("levels");
    const gameScreen = document.getElementById("game");

    function showScreen(name) {
        // Скрываем все экраны
        document.querySelectorAll(".screen").forEach(screen => {
            screen.classList.remove("active");
            screen.style.display = "";
        });
        
        const target = document.getElementById(name);
        if (!target) return;
        
        target.classList.add("active");
        
        // Специфика отображения
        if (name === "game") {
            target.style.display = "block";
        } else {
            target.style.display = "flex";
        }
    }

    document.getElementById("start-btn")?.addEventListener("click", () => showScreen("levels"));
    document.getElementById("exit-btn")?.addEventListener("click", () => {
        window.location.href = "https://github.com";
    });
    document.getElementById("back-btn")?.addEventListener("click", () => showScreen("menu"));

    document.querySelectorAll(".node").forEach(node => {
        node.addEventListener("click", () => {
            const lvl = parseInt(node.dataset.level);
            if (lvl <= unlockedLevel && Object.keys(scenes).length > 0) {
                showScreen("game");
                showScene(lvl === 1 ? "intro" : `lvl${lvl}_intro`);
            }
        });
    });

    function showScene(id) {
        const scene = scenes[id];
        if (!scene) {
            console.error(`Сцена "${id}" не найдена`);
            return;
        }

        // Обновляем контент
        const bg = document.getElementById("background");
        const char = document.getElementById("character");
        const text = document.getElementById("text");
        
        if (bg) bg.src = "assets/" + scene.background;
        if (char) char.src = "assets/" + scene.character;
        if (text) text.innerText = scene.text;

        // Разблокировка следующего уровня при хорошей концовке
        if (id === "good_end" && unlockedLevel < 3) {
            unlockedLevel++;
            updateLevelMap();
        }

        // Создаём кнопки выбора
        const choicesDiv = document.getElementById("choices");
        if (choicesDiv) {
            choicesDiv.innerHTML = "";
            scene.choices.forEach(choice => {
                const btn = document.createElement("button");
                btn.innerText = choice.text;
                btn.onclick = () => {
                    if (choice.next === "menu") {
                        showScreen("menu");
                    } else if (choice.next === "levels") {
                        if (choice.text.includes("Вернуться на карту") && unlockedLevel < 3) {
                            unlockedLevel++;
                            localStorage.setItem("vn_progress", unlockedLevel);
                            updateLevelMap();
                        }
                        showScreen("levels");
                    } else if (choice.next === "good_end") {
                        if (unlockedLevel < 3) {
                            unlockedLevel++;
                            localStorage.setItem("vn_progress", unlockedLevel);
                            updateLevelMap();
                        }
                        showScene("good_end");
                    } else {
                        showScene(choice.next);
                    }
                };
                choicesDiv.appendChild(btn);
            });
        }
    }

    function updateLevelMap() {
        document.querySelectorAll(".node").forEach((node, i) => {
            const lvl = i + 1;
            node.className = "node";
            node.classList.add(
                lvl < unlockedLevel ? "completed" : 
                lvl === unlockedLevel ? "unlocked" : "locked"
            );
            if (unlockedLevel > (localStorage.getItem("vn_progress") || 1)) {
    localStorage.setItem("vn_progress", unlockedLevel);
}
        });
        document.querySelectorAll(".line").forEach((line, i) => {
            line.className = "line";
            if (i + 1 >= unlockedLevel) line.classList.add("locked");
        });
    }
    async function loadScenes() {
        try {
            const res = await fetch("scenes.json");
            if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
            scenes = await res.json();
            console.log("Сцены загружены:", Object.keys(scenes));
            showScreen("menu");
        } catch (err) {
            console.error("Ошибка загрузки сцен:", err);
            if (menuScreen) {
                menuScreen.classList.add("active");
                menuScreen.style.display = "flex";
                const text = document.getElementById("text");
                if (text) text.innerText = "Ошибка загрузки. Проверьте консоль (F12).";
            }
        }
    }

    document.getElementById("reset-btn")?.addEventListener("click", () => {
    if (confirm("Вы уверены, что хотите сбросить весь прогресс?\nЭто действие нельзя отменить.")) {
        localStorage.removeItem("vn_progress");
        unlockedLevel = 1;
        updateLevelMap();
        showScreen("menu"); // Возвращаемся в чистое меню
        console.log("Прогресс сброшен");
    }
});
    loadScenes();
});
