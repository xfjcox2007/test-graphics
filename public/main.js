import {OrbitControls} from './js/examples/OrbitControls.js';
import * as THREE from './js/three.module.js';
import {OBJLoader} from './js/examples/loaders/OBJLoader.js';
import {MTLLoader} from './js/examples/loaders/MTLLoader.js';

//main function contains: animation, mainCanvasInfo, miniCanvasInfo
function main() {

    let pauseSpeed;
    let speed;
    let last = Date.now();
    var theta = 0;
    var dTheta = 2 * Math.PI / 1000;
    let pause;
    let components = {}
    let compomentsMini = {}

    animation()
    function animation() {

        let requestID;
        let requestIDMini;
        let state;


        document.getElementById('btnResume').addEventListener('click', function (e) {
            e.preventDefault();
            if (!state || (state === undefined)) {
                state = true;

                if (speed === undefined) {
                    speed = 1;
                    pause = false;
                } else {
                    speed = pauseSpeed;
                    pause = true;
                }
                last = Date.now()
                requestID = requestAnimationFrame(drawMainCanvas(mainCanvasInfo,pause,components))
                requestIDMini = requestAnimationFrame(drawMiniCanvas(miniCanvasInfo,pause,compomentsMini))
            }
        });

        document.getElementById('btnPause').addEventListener('click', function (e) {
            e.preventDefault();

            if (state) {
                state = false
                pauseSpeed = speed;
                speed = 0;
                cancelAnimationFrame(requestID);
                cancelAnimationFrame(requestIDMini);

                requestID = undefined
                requestIDMini = undefined;
            }

        });

        document.getElementById('btnSpeedUp').addEventListener('click', function (e) {
            e.preventDefault();
            if (state) {
                speed += 0.3
            }
        });

        document.getElementById('btnSlowDown').addEventListener('click', function (e) {
            e.preventDefault();
            if (state && (speed > 0.3)) {
                speed -= 0.3
            }
        });

        // texture loader to load images onto geometries
        const loader = new THREE.TextureLoader();

        // point light
        const pointlight = new THREE.PointLight('#ffdcb4', 1.5);
        pointlight.position.set(0, 0, 0);
        pointlight.castShadow = true
        pointlight.shadow.bias = 0.001
        pointlight.shadow.mapSize.width = 2048;
        pointlight.shadow.mapSize.height = 2048;

        // ambient light
        const ambient = new THREE.AmbientLight(0xaaaaaa);

        // sun geometry
        const sunGeo = new THREE.SphereBufferGeometry(25, 32, 32);
        const sunTexture = loader.load('image/sun6.png')
        const material = new THREE.MeshBasicMaterial({map: sunTexture})
        const sunMesh = new THREE.Mesh(sunGeo, material);
        sunMesh.position.set(0, 0, 0)

        // earth geometry
        const earthGeo = new THREE.SphereBufferGeometry(10, 15, 15);
        const earthMaterial = new THREE.MeshPhongMaterial(
            {map: loader.load("image/earth.jpeg"),
                bumpMap: loader.load('image/elev_bump_8k.jpg')})
        const earthMesh = new THREE.Mesh(earthGeo, earthMaterial);
        earthMesh.position.set(50, 0, 0)

        // create geometries for miniCanvas
        const sunMesh2 = new THREE.Mesh(sunGeo, material);
        sunMesh2.position.set(0, 0, 0)
        const earthMesh2 = new THREE.Mesh(earthGeo, earthMaterial);
        earthMesh2.position.set(50, 0, 0)

        // draw canvas
        const mainCanvasInfo = {
            toDraw: [pointlight, ambient, sunMesh, earthMesh], toRotate: [sunMesh, earthMesh]}
        const miniCanvasInfo = {
            toDraw: [pointlight.clone(), ambient.clone(), sunMesh2, earthMesh2],
            toRotate: [sunMesh2, earthMesh2]}


    }

    function drawMainCanvas(geomtries,pause,components) {

        if (!pause) {


            const canvas = document.querySelector('#mainCanvas');
            const renderer = new THREE.WebGLRenderer({canvas, alpha: true});
            const camera = new THREE.PerspectiveCamera(40, 2, 0.1, 1000);
            camera.position.set(0, 0,200);
            const scene = new THREE.Scene();
            components["camera"] = camera;
            components["renderer"] = renderer
            components["scene"] = scene;
            geomtries.toDraw.forEach((obj) => {
                scene.add(obj)
            })


            // mesh satellite object
            var satelliteMesh = null;
            // const satelliteRotate = satelliteMesh;
            const satellite_mtlLoader = new MTLLoader();
            satellite_mtlLoader.load(
                'objects/satellite/satellite.mtl', (materials) => {
                    materials.preload();
                    // add texture to the satellite
                    var tl = new THREE.TextureLoader();
                    var map = tl.load('objects/satellite/silver.jpg');
                    var material = new THREE.MeshPhongMaterial({map: map});
                    const satellite_objLoader = new OBJLoader();
                    satellite_objLoader.setMaterials(materials);
                    // load object
                    satellite_objLoader.load(
                        'objects/satellite/satellite.obj', (object) => {
                            // For any meshes in the model, add our material.
                            object.traverse( function ( node ) {
                                if ( node.isMesh ) node.material = material;
                            } );
                            satelliteMesh = object;
                            satelliteMesh.position.set(60, 30, 0);
                            // satelliteMesh.scale.set(2,2,2);
                            satelliteMesh.rotation.x = Math.PI / 2;
                            satelliteMesh.rotation.y = -Math.PI / 2;
                            scene.add(satelliteMesh)
                        });
                });
            // mesh asteriod object

            // add texture to the asteriod
            var tl_as = new THREE.TextureLoader();
            var map_as = tl_as.load('objects/asteriod/emission.jpg');
            var material_as = new THREE.MeshPhongMaterial({map: map_as});


            var asteriodMesh = null;
            const asteriod_objLoader = new OBJLoader();
            //  asteriod_objLoader.setMaterials(material_as);
            //  asteriod_objLoader.setMaterials(material_as);

            // load object
            asteriod_objLoader.load(
                'objects/asteriod/asteriod.obj', (object) => {
                    // For any meshes in the model, add our material.
                    // object.traverse( function ( node ) {
                    //     if ( node.isMesh ) node.material = material;
                    // } );
                    asteriodMesh = object;
                    asteriodMesh.position.set(-50, 40, 0);
                    // satelliteMesh.scale.set(2,2,2);
                    //   asteriodMesh.rotation.x = Math.PI / 2;
                    //  asteriodMesh.rotation.y = -Math.PI / 2;
                    scene.add(asteriodMesh)
                });


            // mesh satellite2 object
            var satelliteMesh2 = null;
            // const satelliteRotate = satelliteMesh;
            const satellite_mtlLoader2 = new MTLLoader();
            satellite_mtlLoader2.load(
                'objects/satellite2/omid.mtl', (materials) => {
                    materials.preload();
                    // add texture to the satellite2
                    var tl = new THREE.TextureLoader();
                    var map = tl.load('objects/satellite2/bronze.jpg');
                    var material = new THREE.MeshPhongMaterial({map: map});
                    const satellite_objLoader = new OBJLoader();
                    satellite_objLoader.setMaterials(materials);
                    // load object
                    satellite_objLoader.load(
                        'objects/satellite2/omid.obj', (object) => {
                            // For any meshes in the model, add our material.
                            object.traverse( function ( node ) {
                                if ( node.isMesh ) node.material = material;
                            } );
                            satelliteMesh2 = object;
                            satelliteMesh2.position.set(-100, -30, 0);
                            satelliteMesh2.scale.set(1/4,1/4,1/4);
                            satelliteMesh2.rotation.x = Math.PI / 2;
                            satelliteMesh2.rotation.y = -Math.PI / 2;
                            scene.add(satelliteMesh2);
                        });
                });

            const controls = new OrbitControls(camera, canvas);
            controls.target.set(0, 5, 0)
            controls.update();
            components["controls"] = controls;

        }

        function render() {
            // Date to trace the timestamp
            var now = Date.now();
            var time = (now - last)/10
            last = now;

            // delta for angle
            var delta = dTheta * time * speed;
            theta += delta

            // update y position
            geomtries.toRotate.forEach((obj) => {
                obj.rotation.y += delta;
            })
            rotateEarth(geomtries.toDraw[3], theta)
            resizeRendererToDisplaySize(components.renderer);
            components.renderer.setScissorTest(false);
            components.renderer.clear(true, true);
            components.renderer.setScissorTest(true);

            components.renderer.render(components.scene, components.camera);

            requestAnimationFrame(render);
        }

        return render

    }

    function drawMiniCanvas(geomtries,pause,components) {
        if (!pause) {
            const canvas = document.querySelector('#miniCanvas');
            const renderer = new THREE.WebGLRenderer({canvas, alpha: true});
            const camera = new THREE.PerspectiveCamera(40, 2, 0.1, 1000);
            const scene = new THREE.Scene();

            camera.position.set(0, 200, 0);
            camera.lookAt(0, -1, 0)

            components["camera"] = camera;
            components["renderer"] = renderer
            components["scene"] = scene;

            geomtries.toDraw.forEach((obj) => {
                scene.add(obj)
            })

        }
        function render() {

            var now = Date.now();
            var time = (now - last)/10
            last = now;
            var delta = dTheta * time * speed;
            theta += delta
            geomtries.toRotate.forEach((obj) => {
                obj.rotation.y += delta;
            })
            rotateEarth(geomtries.toDraw[3], theta)
            resizeRendererToDisplaySize(components.renderer);
            components.renderer.setScissorTest(false);
            components.renderer.clear(true, true);
            components.renderer.setScissorTest(true);

            components.renderer.render(components.scene, components.camera);

            requestAnimationFrame(render);
        }
        return render
    }

}

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

// rotate the Earth around the Sun
function rotateEarth(obj, theta) {

    obj.position.x = Math.cos(theta) * 50;
    obj.position.z = Math.sin(theta) * 50;
}


main();