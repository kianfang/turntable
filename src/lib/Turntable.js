"use strict";
var three_1 = require("three");
var raycaster = new three_1.Raycaster();
var mouse = new three_1.Vector2();
var Turntable = (function () {
    function Turntable(options) {
        this.debug = {
            helper: true
        };
        this.shadow = true;
        this.mouse = new three_1.Vector2();
        this.raycaster = new three_1.Raycaster();
        this.initOptions = {
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
        this.targetRotation = 0;
        this.allowActive = ['turntableSmall', 'turntableBig', 'pointer'];
        this.mouse.x = -1;
        this.mouse.y = 1;
        this.initOptions.renderer.width = options.width;
        this.initOptions.renderer.height = options.height;
        this.maps = options.maps;
        this.initScene();
        this.initCamera();
        this.initAmbientLight();
        this.initDirectionalLight();
        this.initPlane();
        this.initBigTurntable();
        this.initSmTurntable();
        this.initPointer();
        this.initRenderer();
    }
    Turntable.prototype.initRenderer = function () {
        this.renderer = new three_1.WebGLRenderer();
        this.renderer.setSize(this.initOptions.renderer.width, this.initOptions.renderer.height);
        document.querySelector("#turntable").appendChild(this.renderer.domElement);
        this.renderer.setClearColor(0x000000, 1.0);
        this.renderer.shadowMap.enabled = this.shadow;
        this.renderer.shadowMap.type = three_1.PCFSoftShadowMap;
    };
    Turntable.prototype.initScene = function () {
        this.scene = new three_1.Scene();
        console.log(this.scene);
        if (this.debug.helper) {
            var axisHelper = new three_1.AxisHelper(1000);
            axisHelper.position.set(0, 0, 0);
            axisHelper.name = 'axisHelper';
            this.scene.add(axisHelper);
            var gridHelper = new three_1.GridHelper(2000, 100, 0x0000ff, 0x808080);
            gridHelper.name = 'gridHelper';
            this.scene.add(gridHelper);
        }
    };
    Turntable.prototype.initCamera = function () {
        this.camera = new three_1.PerspectiveCamera(45, this.initOptions.renderer.width / this.initOptions.renderer.height, 0.1, 5000);
        (_a = this.camera.position).set.apply(_a, this.initOptions.camera.position);
        this.camera.lookAt(new (three_1.Vector3.bind.apply(three_1.Vector3, [void 0].concat(this.initOptions.turntableBig.position)))());
        var _a;
    };
    Turntable.prototype.initAmbientLight = function () {
        var ambientLight = new three_1.AmbientLight(this.initOptions.ambientLight.color);
        ambientLight.name = 'ambientLight';
        (_a = ambientLight.position).set.apply(_a, this.initOptions.ambientLight.position);
        this.scene.add(ambientLight);
        var _a;
    };
    Turntable.prototype.initSpotLight = function () {
        var spotLight = new three_1.SpotLight(this.initOptions.spotLight.color);
        spotLight.name = 'spotLight';
        (_a = spotLight.position).set.apply(_a, this.initOptions.spotLight.position);
        spotLight.castShadow = this.shadow;
        this.scene.add(spotLight);
        (_b = spotLight.shadow.camera).lookAt.apply(_b, this.initOptions.turntableBig.position);
        if (this.debug.helper) {
            var spotLightHelper = new three_1.SpotLightHelper(spotLight);
            spotLightHelper.name = 'spotLightHelper';
            this.scene.add(spotLightHelper);
            var spotLightCameraHelper = new three_1.CameraHelper(spotLight.shadow.camera);
            spotLightCameraHelper.name = 'spotLightCameraHelper';
            this.scene.add(spotLightCameraHelper);
        }
        var _a, _b;
    };
    Turntable.prototype.initPointLight = function () {
        var pointLight = new three_1.PointLight(this.initOptions.pointLight.color, 1.3, 0, 1);
        pointLight.name = 'pointLight';
        (_a = pointLight.position).set.apply(_a, this.initOptions.pointLight.position);
        pointLight.castShadow = this.shadow;
        console.log(pointLight.shadow);
        this.scene.add(pointLight);
        if (this.debug.helper) {
            var pointLightHelper = new three_1.PointLightHelper(pointLight, 1000);
            pointLightHelper.name = 'pointLightHelper';
            this.scene.add(pointLightHelper);
            var pointLightCameraHelper = new three_1.CameraHelper(pointLight.shadow.camera);
            pointLightCameraHelper.name = 'pointLightCameraHelper';
            this.scene.add(pointLightCameraHelper);
        }
        var _a;
    };
    Turntable.prototype.initDirectionalLight = function () {
        var directionalLight = new three_1.DirectionalLight(this.initOptions.directionalLight.color, 1.2);
        directionalLight.name = 'directionalLight';
        (_a = directionalLight.position).set.apply(_a, this.initOptions.directionalLight.position);
        directionalLight.castShadow = this.shadow;
        directionalLight.shadow.camera.near = 300;
        directionalLight.shadow.camera.far = 1000;
        directionalLight.shadow.camera.left = -200;
        directionalLight.shadow.camera.right = 200;
        directionalLight.shadow.camera.top = 200;
        directionalLight.shadow.camera.bottom = -100;
        this.scene.add(directionalLight);
        if (this.debug.helper) {
            var directionalLightHelper = new three_1.DirectionalLightHelper(directionalLight);
            directionalLightHelper.name = 'directionalLightHelper';
            this.scene.add(directionalLightHelper);
            var directionalLightCameraHelper = new three_1.CameraHelper(directionalLight.shadow.camera);
            directionalLightCameraHelper.name = 'directionalLightCameraHelper';
            this.scene.add(directionalLightCameraHelper);
        }
        var _a;
    };
    Turntable.prototype.initPlane = function () {
        var planeGeometry = new (three_1.PlaneBufferGeometry.bind.apply(three_1.PlaneBufferGeometry, [void 0].concat(this.initOptions.plane.geometry)))();
        var planeMaterial = new three_1.MeshStandardMaterial({ color: this.initOptions.plane.color, side: three_1.DoubleSide });
        var plane = new three_1.Mesh(planeGeometry, planeMaterial);
        plane.name = 'plane';
        plane.rotation.x = this.initOptions.plane.rotation[0];
        (_a = plane.position).set.apply(_a, this.initOptions.plane.position);
        plane.receiveShadow = this.shadow;
        this.scene.add(plane);
        var _a;
    };
    Turntable.prototype.initBigTurntable = function () {
        var turntableGeometry = new (three_1.CylinderBufferGeometry.bind.apply(three_1.CylinderBufferGeometry, [void 0].concat(this.initOptions.turntableBig.geometry)))();
        var turntableMaterial = new three_1.MeshStandardMaterial({
            map: this.maps.turntable,
            shading: three_1.SmoothShading
        });
        var turntableBig = new three_1.Mesh(turntableGeometry, turntableMaterial);
        turntableBig.name = 'turntableBig';
        turntableBig.rotation.x = this.initOptions.turntableBig.rotation[0];
        (_a = turntableBig.position).set.apply(_a, this.initOptions.turntableBig.position);
        turntableBig.castShadow = this.shadow;
        this.scene.add(turntableBig);
        var _a;
    };
    Turntable.prototype.initPointer = function () {
        var geom = new three_1.Geometry();
        geom.vertices = [
            new three_1.Vector3(0, 35, 0),
            new three_1.Vector3(0, 10, 4),
            new three_1.Vector3(-4, 10, 0),
            new three_1.Vector3(4, 10, 0),
            new three_1.Vector3(0, 0, 0)
        ];
        geom.faces = [
            new three_1.Face3(0, 1, 2),
            new three_1.Face3(0, 1, 3),
            new three_1.Face3(0, 2, 3),
            new three_1.Face3(1, 2, 4),
            new three_1.Face3(1, 3, 4),
            new three_1.Face3(2, 3, 4)
        ];
        var pointerMaterial = new three_1.MeshStandardMaterial({
            color: 0x0000ff,
            side: three_1.DoubleSide,
            shading: three_1.SmoothShading
        });
        var pointer = new three_1.Mesh(geom, pointerMaterial);
        pointer.name = 'pointer';
        pointer.castShadow = this.shadow;
        pointer.position.set(0, this.initOptions.turntableSmall.position[1], this.initOptions.turntableSmall.geometry[2] * 0.5);
        this.scene.add(pointer);
    };
    Turntable.prototype.initSmTurntable = function () {
        var turntableGeometry = new (three_1.CylinderBufferGeometry.bind.apply(three_1.CylinderBufferGeometry, [void 0].concat(this.initOptions.turntableSmall.geometry)))();
        var turntableMaterial = new three_1.MeshStandardMaterial({
            color: this.initOptions.turntableSmall.color,
            shading: three_1.SmoothShading
        });
        var turntableSmall = new three_1.Mesh(turntableGeometry, turntableMaterial);
        turntableSmall.name = 'turntableSmall';
        turntableSmall.rotation.x = this.initOptions.turntableBig.rotation[0];
        (_a = turntableSmall.position).set.apply(_a, this.initOptions.turntableBig.position);
        turntableSmall.castShadow = this.shadow;
        this.scene.add(turntableSmall);
        var _a;
    };
    Turntable.prototype.render = function () {
        var _this = this;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        var intersects = this.raycaster.intersectObjects(this.scene.children);
        var arr = [];
        intersects.forEach(function (o, index) {
            arr.push(o.object.name);
        });
        this.scene.children.forEach(function (o, index) {
            if (_this.allowActive.indexOf(o.name) === -1)
                return;
            if (intersects.length > 0 && o.name === intersects[0].object.name) {
                o.material.wireframe = true;
            }
            else {
                o.material.wireframe = false;
            }
        });
        var turntable = this.scene.getObjectByName("turntableBig");
        turntable.rotation.y += (this.targetRotation - turntable.rotation.y) * 0.05;
        this.renderer.render(this.scene, this.camera);
    };
    return Turntable;
}());
exports.Turntable = Turntable;
