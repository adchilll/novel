document.addEventListener("DOMContentLoaded", () => {
    let scenes = {};
    let unlockedLevel = 1;

    const menuScreen = document.getElementById("menu");
    const levelScreen = document.getElementById("levels");
    const gameScreen = document.getElementById("game");

    function showScreen(name) {
        menuScreen.style.display = "none";
        levelScreen.style.display = "none";
        gameScreen.style.display = "none";

        if (name === "menu") menuScreen.style.display = "flex";
        else if (name === "levels") levelScreen.style.display = "flex";
        else if (name === "game") gameScreen.style.display = "block";
    }

    // Кнопки меню
    document.getElementById("start-btn").addEventListener("click", () => showScreen("levels"));
    document.getElementById("exit-btn").addEventListener("click", () => window.location.href = "https://github.com"); // ← поменяйте ссылку при желании
    document.getElementById("back-btn").addEventListener("click", () => showScreen("menu"));

    // Кружки уровней
    document.querySelectorAll(".node").forEach(node => {
        node.addEventListener("click", () => {
            const lvl = parseInt(node.dataset.level);
            if (lvl <= unlockedLevel) {
                showScreen("game");
                showScene(lvl === 1 ? "intro" : `level${lvl}_start`);
            }
        });
    });

    async function loadScenes() {
        const res = await fetch("scenes.json");
        scenes = await res.json();
        showScreen("menu"); // Показываем главный экран после загрузки
    }

    function showScene(id) {
        const scene = scenes[id];
        if (!scene) return;

        document.getElementById("background").src = "assets/" + scene.background;
        document.getElementById("character").src = "assets/" + scene.character;
        document.getElementById("text").innerText = scene.text;

        if (id === "good_end" && unlockedLevel < 3) {
            unlockedLevel++;
            updateLevelMap();
        }

        const choicesDiv = document.getElementById("choices");
        choicesDiv.innerHTML = "";

        scene.choices.forEach(choice => {
            const btn = document.createElement("button");
            btn.innerText = choice.text;
            btn.onclick = () => showScene(choice.next);
            choicesDiv.appendChild(btn);
        });
    }

    function updateLevelMap() {
        document.querySelectorAll(".node").forEach((node, i) => {
            const lvl = i + 1;
            node.className = "node";
            node.classList.add(lvl < unlockedLevel ? "completed" : lvl === unlockedLevel ? "unlocked" : "locked");
        });
        document.querySelectorAll(".line").forEach((line, i) => {
            line.className = "line";
            if (i + 1 >= unlockedLevel) line.classList.add("locked");
        });
    }

    loadScenes();
});
