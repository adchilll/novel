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

function showScreen(name) {
    // Скрываем все экраны через удаление класса
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });
    
    // Показываем нужный
    const target = document.getElementById(name);
    if (target) {
        target.classList.add("active");
    }
    
    // Специфика для #game (если нужен display: block вместо flex)
    if (name === "game") {
        target.style.display = "block";
    } else {
        target.style.display = "";
    }
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
    async function loadScenes() {
    try {
        const res = await fetch("scenes.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        scenes = await res.json();
        showScreen("menu");
    } catch (err) {
        console.error("Ошибка загрузки сцен:", err);
        menuScreen.style.display = "flex"; // Показываем меню даже при ошибке
    }
}
});
