import {
    WebGLRenderer,
    PCFSoftShadowMap,
    Scene,
    PerspectiveCamera,
    CameraHelper,
    Vector3,
    Face3,
    AmbientLight,
    SpotLight,
    SpotLightHelper,
    PointLight,
    PointLightHelper,
    DirectionalLight,
    DirectionalLightHelper,
    PlaneBufferGeometry,
    Geometry,
    CylinderBufferGeometry,
    MeshStandardMaterial,
    Mesh,
    DoubleSide,
    GridHelper,
    AxisHelper,
    Raycaster,
    Vector2,
    SmoothShading,
    FlatShading
} from "three";

let raycaster = new Raycaster();
let mouse = new Vector2();

export class Turntable {
    debug: any = {
        helper: true
    };
    shadow: boolean = true;

    mouse:any = new Vector2();
    raycaster:any = new Raycaster();

    renderer: any;
    camera: any;
    scene: any;

    initOptions: any = {
        renderer: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        camera: {
            position: [0, 200, 300],
            look: [0, 0, 0]
        },
        ambientLight: {
            position: [0, 0, 0],
            color: 0x999999
        },
        directionalLight: {
            position: [300, 300, 500],
            color: 0xffffff
        },
        spotLight: {
            position: [50, 260, 100],
            color: 0xFFFFFF
        },
        pointLight: {
            position: [100, 200, 500],
            color: 0xFFFFFF
        },
        plane: {
            geometry: [800, 800],
            color: 0x00ff00,
            position: [0, 0, 0],
            rotation: [-0.5 * Math.PI, 0, 0],
        },
        turntableBig: {
            geometry: [80, 80, 10, 256, 1, false, 0, 2 * Math.PI],
            color: 0xcccccc,
            position: [0, 100, 0],
            rotation: [0.5 * Math.PI, 0, 0],
        },
        turntableSmall: {
            geometry: [23, 23, 11, 64, 1, false, 0, 2 * Math.PI],
            color: 0xff0000,
            position: [0, 100, 0],
            rotation: [0.5 * Math.PI, 0, 0],
        }
    };

    maps: any;

    targetRotation: number = 0;

    constructor(options) {
        this.mouse.x = -1;
        this.mouse.y = 1;
        this.initOptions.renderer.width = options.width;
        this.initOptions.renderer.height = options.height;
        this.maps = options.maps;

        this.initScene();
        this.initCamera();

        this.initAmbientLight();
        // this.initSpotLight();
        this.initDirectionalLight();
        // this.initPointLight();

        this.initPlane();
        this.initBigTurntable();
        this.initSmTurntable();
        this.initPointer();

        this.initRenderer();
    }

    initRenderer() {
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(this.initOptions.renderer.width, this.initOptions.renderer.height);
        document.querySelector("#turntable").appendChild(this.renderer.domElement);
        this.renderer.setClearColor(0x000000, 1.0);

        this.renderer.shadowMap.enabled = this.shadow;
        this.renderer.shadowMap.type = PCFSoftShadowMap;
    }

    initScene() {
        this.scene = new Scene();
        console.log(this.scene);

        if(this.debug.helper) {
            let axisHelper:any = new AxisHelper(1000);
            axisHelper.position.set(0,0,0);
            axisHelper.name = 'axisHelper';
            this.scene.add(axisHelper);

            let gridHelper = new GridHelper(2000, 100, 0x0000ff, 0x808080);
            gridHelper.name = 'gridHelper';
            this.scene.add(gridHelper);

            // gui = dat.GUIVR.create("Ball Wave");
        }
    }
    // 相机
    initCamera() {
        this.camera = new PerspectiveCamera(45, this.initOptions.renderer.width / this.initOptions.renderer.height, 0.1, 5000);
        this.camera.position.set(...this.initOptions.camera.position);
        // this.camera.up.x = 0;
        // this.camera.up.y = 1;
        // this.camera.up.z = 0;
        this.camera.lookAt(new Vector3(...this.initOptions.turntableBig.position));
        // if(this.debug.helper) {
        //     let cameraHelper = new CameraHelper(this.camera);
        //     cameraHelper.name = 'cameraHelper';
        //     this.scene.add(cameraHelper);
        // }

    }
    // 对象色 环境色
    initAmbientLight() {
        let ambientLight = new AmbientLight(this.initOptions.ambientLight.color);
        ambientLight.name = 'ambientLight';
        ambientLight.position.set(...this.initOptions.ambientLight.position);
        this.scene.add(ambientLight);
    }
    // 灯光
    initSpotLight() {
        let spotLight = new SpotLight(this.initOptions.spotLight.color);
        spotLight.name = 'spotLight';
        spotLight.position.set(...this.initOptions.spotLight.position);

        spotLight.castShadow = this.shadow;
        this.scene.add(spotLight);

        // spotLight.shadow.mapSize.width = 500;
        // spotLight.shadow.mapSize.height = 500;
        // spotLight.shadow.camera.near = 0.5;
        // spotLight.shadow.camera.far = 100
        // spotLight.shadow.camera.fov = 0
        // spotLight.shadow.camera.up = 1000
        // spotLight.shadow.camera.button = 500
        // spotLight.shadow.camera.left = 500
        // spotLight.shadow.camera.right = 500

        spotLight.shadow.camera.lookAt(...this.initOptions.turntableBig.position);

        if (this.debug.helper) {
            let spotLightHelper = new SpotLightHelper(spotLight);
            spotLightHelper.name = 'spotLightHelper';
            this.scene.add(spotLightHelper);

            let spotLightCameraHelper = new CameraHelper(spotLight.shadow.camera);
            spotLightCameraHelper.name = 'spotLightCameraHelper';
            this.scene.add(spotLightCameraHelper);
        }
    }
    // 点光
    initPointLight() {
        let pointLight = new PointLight(this.initOptions.pointLight.color, 1.3, 0, 1);
        pointLight.name = 'pointLight';
        pointLight.position.set(...this.initOptions.pointLight.position);

        pointLight.castShadow = this.shadow;

        console.log(pointLight.shadow);

        // pointLight.shadow.mapSize.width = 100;  // default
        // pointLight.shadow.mapSize.height = 100; // default
        // pointLight.shadow.camera.near = 2;       // default
        // pointLight.shadow.camera.far = 1000      // default
        this.scene.add(pointLight);

        if (this.debug.helper) {
            let pointLightHelper = new PointLightHelper(pointLight, 1000);
            pointLightHelper.name = 'pointLightHelper';
            this.scene.add(pointLightHelper);
            let pointLightCameraHelper = new CameraHelper(pointLight.shadow.camera);
            pointLightCameraHelper.name = 'pointLightCameraHelper';
            this.scene.add(pointLightCameraHelper);
        }
    }
    // 直行光 太阳光
    initDirectionalLight() {
        let directionalLight:any = new DirectionalLight(this.initOptions.directionalLight.color, 1.2);
        directionalLight.name = 'directionalLight';
        directionalLight.position.set(...this.initOptions.directionalLight.position);

        directionalLight.castShadow = this.shadow;
        // directionalLight.shadow.mapSize.width = 512;  // default
        // directionalLight.shadow.mapSize.height = 512; // default
        directionalLight.shadow.camera.near = 300;       // default
        directionalLight.shadow.camera.far = 1000      // default
        // directionalLight.shadow.camera.lookAt(100,100,100)     // default
        directionalLight.shadow.camera.left = -200;
        directionalLight.shadow.camera.right = 200;
        directionalLight.shadow.camera.top = 200;
        directionalLight.shadow.camera.bottom = -100;

        this.scene.add(directionalLight);

        if (this.debug.helper) {
            let directionalLightHelper = new DirectionalLightHelper(directionalLight);
            directionalLightHelper.name = 'directionalLightHelper';
            this.scene.add(directionalLightHelper);
            let directionalLightCameraHelper = new CameraHelper(directionalLight.shadow.camera);
            directionalLightCameraHelper.name = 'directionalLightCameraHelper';
            this.scene.add(directionalLightCameraHelper);
        }
    }
    // 平面
    initPlane() {
        let planeGeometry = new PlaneBufferGeometry(...this.initOptions.plane.geometry);
        let planeMaterial = new MeshStandardMaterial({ color: this.initOptions.plane.color, side: DoubleSide });
        let plane = new Mesh(planeGeometry, planeMaterial);
        plane.name = 'plane';
        plane.rotation.x = this.initOptions.plane.rotation[0];
        plane.position.set(...this.initOptions.plane.position);

        plane.receiveShadow = this.shadow;

        this.scene.add(plane);
    }
    // 大轮盘
    initBigTurntable() {
        let turntableGeometry = new CylinderBufferGeometry(...this.initOptions.turntableBig.geometry);
        let turntableMaterial = new MeshStandardMaterial({
            // color: this.initOptions.turntableBig.color,
            map: this.maps.turntable,
            shading: SmoothShading
        });

        let turntableBig = new Mesh(turntableGeometry, turntableMaterial);
        turntableBig.name = 'turntableBig';
        turntableBig.rotation.x = this.initOptions.turntableBig.rotation[0];
        turntableBig.position.set(...this.initOptions.turntableBig.position);

        turntableBig.castShadow = this.shadow;
        // turntableBig.receiveShadow = true;
        //
        this.scene.add(turntableBig);
    }
    // 自定义指针
    initPointer() {
        let geom = new Geometry();
        geom.vertices = [
            new Vector3(0, 35, 0),
            new Vector3(0, 10, 4),
            new Vector3(-4, 10, 0),
            new Vector3(4, 10, 0),
            new Vector3(0, 0, 0)
        ];

        geom.faces = [
            new Face3(0, 1, 2),
            new Face3(0, 1, 3),
            new Face3(0, 2, 3),
            // new Face3(1,2,3),
            new Face3(1, 2, 4),
            new Face3(1, 3, 4),
            new Face3(2, 3, 4)
        ];

        // geom.computeCentroids();
        // geom.mergeVertices();
        let pointerMaterial = new MeshStandardMaterial({
            color: 0x0000ff,
            side: DoubleSide,
            shading: SmoothShading
        });
        let pointer = new Mesh(geom, pointerMaterial);
        pointer.name = 'pointer';
        pointer.castShadow = this.shadow;
        pointer.position.set(0, this.initOptions.turntableSmall.position[1], this.initOptions.turntableSmall.geometry[2] * 0.5);

        this.scene.add(pointer);
    }

    // 大轮盘
    initSmTurntable() {
        let turntableGeometry = new CylinderBufferGeometry(...this.initOptions.turntableSmall.geometry);
        let turntableMaterial = new MeshStandardMaterial({
            color: this.initOptions.turntableSmall.color,
            shading: SmoothShading
        });
        let turntableSmall = new Mesh(turntableGeometry, turntableMaterial);
        turntableSmall.name = 'turntableSmall';
        turntableSmall.rotation.x = this.initOptions.turntableBig.rotation[0];
        turntableSmall.position.set(...this.initOptions.turntableBig.position);

        turntableSmall.castShadow = this.shadow;
        // turntableSmall.receiveShadow = true;

        // if(this.shadow) {
        //     turntableSmall.castShadow = true;
        // }
        this.scene.add(turntableSmall);
    }

    allowActive:string[] = ['turntableSmall', 'turntableBig', 'pointer'];
    render() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        let intersects = this.raycaster.intersectObjects(this.scene.children);
        // console.log(intersects.length);
        let arr = [];
        intersects.forEach((o, index) => {
            arr.push(o.object.name);
        });
        // console.log(arr);

        this.scene.children.forEach((o, index) => {
            if(this.allowActive.indexOf(o.name) === -1) return;
            if(intersects.length>0 && o.name===intersects[0].object.name) {
                o.material.wireframe = true;
            } else {
                o.material.wireframe = false;
            }

            // if(this.allowActive.indexOf(o.name) === -1) return;
            // if(arr.indexOf(o.name) === -1) {
            //     o.material.wireframe = false;
            // } else {
            //     o.material.wireframe = true;
            // }
        });

        let turntable = this.scene.getObjectByName("turntableBig");
        turntable.rotation.y += (this.targetRotation - turntable.rotation.y ) * 0.05;

        this.renderer.render(this.scene, this.camera);
    }

} // Turntable Class
