let scenes = {};
let unlockedLevel = 1;

const menuScreen = document.getElementById("menu");
const levelScreen = document.getElementById("levels");
const gameScreen = document.getElementById("game");

document.getElementById("start-btn").onclick = () => showScreen("levels");
document.getElementById("exit-btn").onclick = () => window.close() || location.reload();
document.getElementById("back-btn").onclick = () => showScreen("menu");

document.querySelectorAll(".node").forEach(node => {
    node.onclick = () => {
        const lvl = parseInt(node.dataset.level);
        if (lvl <= unlockedLevel) {
            showScreen("game");
            // Уровень 1 стартует с intro, для 2 и 3 позже добавите level2_start и level3_start в JSON
            const startScene = lvl === 1 ? "intro" : `level${lvl}_start`;
            showScene(startScene);
        }
    };
});

function showScreen(name) {
    menuScreen.classList.remove("active");
    levelScreen.classList.remove("active");
    gameScreen.classList.remove("show");

    if (name === "menu") menuScreen.classList.add("active");
    else if (name === "levels") levelScreen.classList.add("active");
    else if (name === "game") gameScreen.classList.add("show");
}

async function loadScenes() {
    const res = await fetch(`scenes.json?v=${Date.now()}`);
    scenes = await res.json();
}

function showScene(id) {
    const scene = scenes[id];
    if (!scene) return;

    document.getElementById("background").src = "assets/" + scene.background;
    document.getElementById("character").src = "assets/" + scene.character;
    document.getElementById("text").innerText = scene.text;

    // Разблокировка следующего уровня при успешном финале
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
        node.classList.remove("locked", "unlocked", "completed");
        if (lvl < unlockedLevel) node.classList.add("completed");
        else if (lvl === unlockedLevel) node.classList.add("unlocked");
        else node.classList.add("locked");
    });
    document.querySelectorAll(".line").forEach((line, i) => {
        line.classList.toggle("locked", i + 1 >= unlockedLevel);
    });
}

loadScenes();
