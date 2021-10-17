import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, light, plane, controls, mouse, rayCast;
let cubes = [];

//score
let scores = 0, match = 1, unmatch = -1;
let scoreElement = document.getElementById("score");
//UI start game
// const instructionsElement = document.getElementById("instructions");

//cube management
let randomInRange = function (from, to) {
    let x = Math.random() * (to - from);
    return x + from;
};
const colors = [0x5FD1FF, 0xFD824E, 0xE4FF41, 0xFF4185];
const maxArea = 30;
const minArea = -30;
const rangeArea = maxArea - minArea;

const createGeometry = () => {
    const random_color = colors[Math.floor(randomInRange(0, 4))];
    const material = new THREE.MeshToonMaterial({ color: random_color});
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = randomInRange(-30, 30)
    cube.position.y = randomInRange(0, 10)
    cube.position.z = randomInRange(-10, 30)

    cubes.push(cube);
    scene.add(cube);
};
let selectedCubes = [];
let cubesColor = [];
//remove cube yg warnannya sama
const removeCube = () => {
    let cube1 = selectedCubes[0].material.color.getHex();
    let cube2 = selectedCubes[1].material.color.getHex();

    if (cube1 == cube2) {
        selectedCubes.forEach(object => {
            console.log('haaiii')
            object.geometry.dispose();
            object.material.dispose();
            scene.remove(object);
            renderer.renderLists.dispose();

        });
        scores += match;
        // scores+=1
        // console.log(scores);
    }
    else if (cube1 != cube2) scores += unmatch;
    // if(scores<0) scores=0 //supaya UI scores ga minus
    scoreElement.innerHTML = scores;
    cubesColor = [];
    selectedCubes = [];
}

//event listener : mouse click
let onMouseClick = function (e) {

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    // mouse.z = 1;
    rayCast.setFromCamera(mouse, camera);
    let intersects = rayCast.intersectObjects(scene.children, false)
    if (intersects[0]) {
        let cube1 = intersects[0].object;
        if (selectedCubes.length > 0) {
            if (cube1.uuid === selectedCubes[0].uuid) {
                cube1.material.emissive.setHex(0x8B7687);
                selectedCubes = [];
                cubesColor = [];
                return;
            }
        }
        selectedCubes.push(cube1);
        cubesColor.push(cube1.material.color.getHex());
        if (selectedCubes.length > 1) {
            removeCube();
        }

    }
}

let lighting = function () {
    const skyColor = 0xe5dad7;  // light blue
    const groundColor = 0x423835;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
    const dLight = new THREE.DirectionalLight(0x000000, 1, 100);
    dLight.position.set(0, 0.5, 0); //default; dLight shining from top
    dLight.castShadow = true; // default false
    scene.add(dLight);
}
//UI
// const instructionsElement = document.getElementById("instructions");   
let floorplane = function () {
    plane = new THREE.Mesh(
        new THREE.BoxGeometry(70, 70, 2),
        new THREE.MeshPhongMaterial({ color: 0xe7f4f4, wireframe: false, shininess: 0.8 }));
    plane.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
    plane.position.y = -3
    plane.position.z = 8
    scene.add(plane);
}

// set up the environment - 
// initiallize scene, camera, objects and renderer
let init = function () {
    scene = new THREE.Scene();
    const loader = new THREE.TextureLoader();
    const bgTexture = loader.load('https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8&w=1000&q=80');
    scene.background = bgTexture;
    //scene.background = new THREE.Color(0x7f5e55);
    //scene.rotateX(-Math.PI * 0.25)
    //scene.rotateY(Math.PI * 0.04)
    //scene.rotateZ(Math.PI * 0.7)

    camera = new THREE.PerspectiveCamera(115,
        window.innerWidth / window.innerHeight,
        1, 1000);
    camera.position.set(0, 10, 52);

    // if (instructionsElement) instructionsElement.style.display = "none";
    lighting()
    floorplane()
    for (let i = 0; i < 30; i++) {
        createGeometry();
    }

    rayCast = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    mouse.x = mouse.y = -1;
    // 4. create the renderer   
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const controls = new OrbitControls(camera, renderer.domElement);
    renderer.render(scene, camera, controls);
    document.body.appendChild(renderer.domElement);
    document.addEventListener('click', onMouseClick, false);
};


// main animation loop - calls 50-60 times per second.
let speed = 0.002, addSpeed = 0.01
let mainLoop = function () {
    if (scene.children.length >= 40) {
        //berhenti tambah cube kalau jumlah cube sudah mencapai 40
        addSpeed = 0.01
        speed = 0.01
        scoreElement.innerHTML = scores
    }
    if (addSpeed > 0.1) {
        createGeometry()
        addSpeed = 0
        speed += 0.01
    }
    else addSpeed += speed
    const clock = new THREE.Clock();
    const elapsedTime = clock.getElapsedTime()

    if (selectedCubes.length > 0)
        selectedCubes[0].material.emissive.setHex(elapsedTime % 0.5 >= 0.25 ? original[0] : 0x000000)

    renderer.render(scene, camera, controls);
    requestAnimationFrame(mainLoop);

}

///////////////////////////////////////////////
init();
mainLoop();
