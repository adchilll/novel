let scenes = {};
let currentScene = "intro";

async function loadScenes(){
    const response = await fetch("scenes.json");
    scenes = await response.json();
    showScene(currentScene);
}

function showScene(id){
    const scene = scenes[id];

    document.getElementById("background").src =
        "assets/" + scene.background;

    document.getElementById("character").src =
        "assets/" + scene.character;

    document.getElementById("text").innerText =
        scene.text;

    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";

    scene.choices.forEach(choice => {
        const button = document.createElement("button");
        button.innerText = choice.text;
        button.onclick = () => {
            showScene(choice.next);
        };
        choicesDiv.appendChild(button);
    });
}

loadScenes();
