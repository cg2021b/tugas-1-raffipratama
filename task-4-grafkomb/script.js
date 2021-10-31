import * as THREE from '/JS/three.module.js';
import { OrbitControls } from '/JS/OrbitControls.js';
import { GLTFLoader } from '/JS/GLTFLoader.js';
import { DragControls } from '/JS/DragControls.js';
import { CubeCamera, Light } from '/JS/three.module.js';
import { FlakesTexture } from '/JS/FlakesTexture.js';
import { RGBELoader } from '/JS/RGBELoader.js';
import { Reflector } from '/JS/Reflector.js';


function main() {

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    })


    // Canvas
    const canvas = document.querySelector('canvas.webgl')

    //scene
    const scene = new THREE.Scene();

    //Renderer
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.gammaOutput = true;
    //Panorama
    {
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            'images/px.png',
            'images/nx.png',
            'images/py.png',
            'images/ny.png',
            'images/pz.png',
            'images/nz.png',
        ]);
        scene.background = texture;
    }

    /**
 * Object: Sphere (lamp)
 */
    const geometry = new THREE.SphereGeometry(0.2, 30, 30);
    const loader3 = new THREE.TextureLoader();
    loader3.load('images/moon.jpg', (sun) => {
        const material = new THREE.MeshBasicMaterial({
            map: sun,
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.x = 2;
        sphere.position.y = -1.3;
        sphere.position.z = 2;
        sphere.receiveShadow = true;
        sphere.castShadow = true;
        scene.add(sphere);

    });

    const geometry2 = new THREE.SphereGeometry(0.2, 30, 30);
    const loader5 = new THREE.TextureLoader();
    loader5.load('images/moon.jpg', (sun) => {
        const material = new THREE.MeshBasicMaterial({
            map: sun,
        });
        const sphere2 = new THREE.Mesh(geometry, material);
        sphere2.position.x = 2;
        sphere2.position.y = -1.3;
        sphere2.position.z = -2;
        sphere2.receiveShadow = true;
        sphere2.castShadow = true;
        scene.add(sphere2);

    });
    //kaca
    let planeMirror = new THREE.PlaneGeometry(5, 5);
    const verticalMirror = new Reflector(planeMirror, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x2C2C2C,
        side: THREE.DoubleSide
    });
    verticalMirror.rotation.y = Math.PI / 2;
    verticalMirror.position.x = -2.5;
    verticalMirror.position.y = 0;
    verticalMirror.position.z = 0;
    scene.add(verticalMirror);

    //Alas
    const loader4 = new THREE.TextureLoader().load('./images/keramik.jpg');

    let grassPlane = new THREE.BoxGeometry(5, 5);
    let grassMaterial = new THREE.MeshLambertMaterial({
        map: loader4
    });

    let plane = new THREE.Mesh(grassPlane, grassMaterial);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = -2;
    plane.receiveShadow = true;
    plane.castShadow = true;
    scene.add(plane);

    /**
 * Object patung
 */
    const materials = [];
    const loaderGLTF = new GLTFLoader();
    loaderGLTF.load('./images/scene.gltf', function (gltf) {
        console.log(gltf);
        const root = gltf.scene;
        root.position.x = -1;
        root.position.y = -1.5;
        root.position.z = 0;
        scene.add(root);
        //console.log(dumpObject(root).join('\n'));
        root.traverse(function (object) {
            if (object.isMesh) {
                object.castShadow = true;
                object.receiveShadow = true;
                //roughnessMipmapper.generateMipmaps( object.material );
            }
        });
    },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + "% Loaded");
        },
        function (error) {
            console.log('An Error Occurred');
        })


    //light
    //1
    const solarLight = new THREE.DirectionalLight();
    solarLight.position.set(200, 300, 0);
    solarLight.castShadow = true;
    solarLight.intensity = 0.4;
    solarLight.shadow.mapSize.width = 2048;
    solarLight.shadow.mapSize.height = 2048;
    solarLight.shadow.camera.near = 250;
    solarLight.shadow.camera.far = 1000;

    let intensity = 2;

    solarLight.shadow.camera.left = -intensity;
    solarLight.shadow.camera.right = intensity;
    solarLight.shadow.camera.top = intensity;
    solarLight.shadow.camera.bottom = -intensity;
    scene.add(solarLight);

    //2
    const distance = 5.0;
    const angle = Math.PI / 10.0;
    const penumbra = 5;
    const decay = 1.0;
    const spotLight = new THREE.SpotLight(0xFF0000, 1.0, distance, angle, penumbra, decay);
    spotLight.position.set(1.8, -0.8, 2);
    scene.add(spotLight);

    const spotLight2 = new THREE.SpotLight(0x1400FF, 1.0, distance, angle, penumbra, decay);
    spotLight2.position.set(1.8, -0.8, -2);
    scene.add(spotLight2);

    // const spotLightHelper = new THREE.SpotLightHelper( spotLight );
    // scene.add( spotLightHelper );


    //helper
    // const light = new THREE.DirectionalLight(0xFFFFFF);
    // const helper = new THREE.DirectionalLightHelper(light, 5);
    // scene.add(helper);

    //fog
    const near = 1.5;
    const far = 20;
    const color = 'lightblue';
    scene.fog = new THREE.Fog(color, near, far);

    //Camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 100);
    camera.position.x = -1;
    camera.position.y = 5;
    camera.position.z = 2;
    scene.add(camera);

    //Rotate
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render(time) {
        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

main();