import {Textures} from "./lib/Textures";
import {Turntable} from "./lib/Turntable";

import * as $ from "jquery";
import * as dat from "dat.gui/build/dat.gui.min.js";

$(async () => {
    let $turntable = $("#turntable");

    let textures = new Textures();
    let maps = {
        turntable: await textures.turntable()
    };

    let turnTable = new Turntable({
        maps: maps,
        width: $turntable.width(),
        height: $turntable.height()
    });

    let gui = new dat.GUI();
    let guiOptions = {
        "scene rotation y": turnTable.scene.rotation.y,
        "camera position z": turnTable.camera.position.z,
        "camera position y": turnTable.camera.position.y
    };

    (function render(){
        turnTable.render();
        requestAnimationFrame(render);
    }());

    // gui.add(turnTable.scene.rotation, 'x', 0, Math.PI * 2);
    gui.add(guiOptions, 'scene rotation y', 0, Math.PI * 2).onChange(value => turnTable.scene.rotation.y=value);
    gui.add(guiOptions, 'camera position z', 0, 5000).onChange(value => turnTable.camera.position.z=value);
    gui.add(guiOptions, 'camera position y', 0, 5000).onChange(value => turnTable.camera.position.y=value);
    // gui.add(turnTable.scene.rotation, 'z', 0, Math.PI * 2);

    // let mouseout:boolean = false;
    //  $turntable.on("mouseenter", function(e){
    //     mouseout = false;
    // }).on("mouseout", function(e){
    //     mouseout = true;
    // });

    // let touchstart:boolean = false;
    // let touchend:boolean = true;
    // let startTurnY:number = 0;

    let centerMouseX = $turntable.width() * 0.5;
    let centerMouseY = $turntable.height() * 0.5;
    let startMouseX:number = 0;
    let startMouseY:number = 0;
    let targetRotationMouseStart = 0;

    let centerTouchX = $(window).width() * 0.5;
    let centerTouchY = $(window).height() * 0.5;
    let startTouchX:number = 0;
    let startTouchY:number = 0;
    let targetRotationTouchStart = 0;

    let startTime:number = Date.now();
    let endTime:number = Date.now();
    let step:number = 0.1;


    // let startAction:number = 50;
    // let move:number = 0;
    // let direction:number = 0;
    // let speed:number = 0;
    $turntable.on("mousedown", function(e) {
        startMouseX = e.offsetX;
        startMouseY = e.offsetY;

        targetRotationMouseStart = turnTable.targetRotation;

        $(this).on("mousemove", (e) => {
            let moveX = e.offsetX - startMouseX;
            let moveY = e.offsetY - startMouseY;

            // let val = Math.atan((startMouseY - centerY) / (startMouseX - centerY)) - Math.atan((e.offsetY - centerY) / (e.offsetX - centerX));
            let val = (startMouseY - centerMouseY) * (e.offsetX - centerMouseX) - (startMouseX - centerMouseX) * (e.offsetY - centerMouseY);
            let direction = val > 0 ? 1 : -1;

            // let direction = moveX * moveY / Math.abs(moveX * moveY);
            turnTable.targetRotation = targetRotationMouseStart + Math.sqrt(moveX*moveX + moveY*moveY) * step * direction;
        });

        $(this).on("mouseup mouseout", (e) => {
            $(this).off("mousemove mouseup mouseout");
        })

    }).on("touchstart", function(e:any) {
        console.log(e);
        startTouchX = e.touches[0].clientX;
        startTouchY = e.touches[0].clientY;
        console.log(startTouchX, startTouchY);
        targetRotationTouchStart = turnTable.targetRotation;
        $(this).on("touchmove", (e:any) => {
            let moveX = e.touches[0].clientX - startTouchX;
            let moveY = e.touches[0].clientY - startTouchY;

            let val = (startTouchY - centerTouchY) * (e.touches[0].clientX - centerTouchX) - (startTouchX - centerTouchX) * (e.touches[0].clientY - centerTouchY) ;

            let direction = val > 0 ? 1 : -1;
            turnTable.targetRotation = targetRotationTouchStart + Math.sqrt(moveX*moveX + moveY*moveY) * step * direction;
        })

        $(this).on("touchend", (e) => {
            $(this).off("touchmove");
        })
    });

    $turntable.children("canvas").on("mousemove", function(e) {
        turnTable.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
        turnTable.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    })



    // $turntable.on("mousedown", function(e) {
    //     // console.log(e);
    //     touchstart = true;
    //     touchend = false;
    //     move = 0;
    //     direction = 0;
    //     speed = 0;
    //
    //     startMouseX = e.clientX;
    //     startMouseY = e.clientY;
    //
    //     startTime = Date.now();
    //
    //     startTurnY = turnTable.scene.getObjectByName('turntableBig').rotation.y;
    // }).on("touchstart", function(e:any) {
    //     console.log(e);
    //     touchstart = true;
    //     touchend = false;
    //
    //     move = 0;
    //     direction = 0;
    //     speed = 0;
    //
    //     startMouseX = e.touches[0].clientX;
    //     startMouseY = e.touches[0].clientY;
    //
    //     startTime = Date.now();
    //
    //     startTurnY = turnTable.scene.getObjectByName("turntableBig").rotation.y;
    // });
    //
    // $turntable.on("mousemove", function(e:any) {
    //     turnTable.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    // 	turnTable.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    //     // console.log(turnTable.mouse);
    //     if(!mouseout && touchstart) {
    //         let value = startMouseY - e.clientY;
    //         move = Math.abs(value);
    //         direction = value / move;
    //         if(move > startAction) {
    //             turnTableGo();
    //         }
    //         // console.log(e.clientY - startMouseY);
    //     }
    // }).on("touchmove", function(e:any) {
    //     if(touchstart) {
    //         let value = startMouseY - e.touches[0].clientY;
    //         move = Math.abs(value);
    //         direction = value / move;
    //         if(move > startAction) {
    //             turnTableGo();
    //         }
    //         // console.log(e.clientY - startMouseY);
    //     }
    // });
    //
    //  $turntable.on("mouseup", function(e) {
    //     console.log(e);
    //     touchstart = false;
    //     touchend = true;
    //
    //     endTime = Date.now();
    //
    //     speed = move / (endTime - startTime) * 1000;
    //     console.log(speed);
    //     if(move > startAction && speed > 2000 && !mouseout) {
    //         (function rotate() {
    //             let arg = arguments;
    //             setTimeout(() => {
    //                 move += speed;
    //                 let decrease = parseInt(speed.toString()).toString().length - 2;
    //                 if(decrease > 0) speed -= Math.pow(10, decrease);
    //                 else speed -= 1;
    //
    //                 console.log(speed);
    //                 turnTableGo()
    //                 if(touchend && speed > 0) {
    //                     rotate();
    //                 }
    //             }, 50);
    //         }());
    //     }
    //
    // }).on("touchend", function(e) {
    //     console.log(e);
    //     touchstart = false;
    //     touchend = true;
    //
    //     endTime = Date.now();
    //
    //     speed = move / (endTime - startTime) * 1000;
    //     console.log(speed);
    //     if(move > startAction && speed > 1500) {
    //         (function rotate() {
    //             let arg = arguments;
    //             setTimeout(() => {
    //                 move += speed;
    //                 let decrease = parseInt(speed.toString()).toString().length - 2;
    //                 if(decrease > 0) speed -= Math.pow(10, decrease);
    //                 else speed -= 1;
    //
    //                 console.log(speed);
    //                 turnTableGo();
    //                 if(touchend && speed > 0) {
    //                     rotate();
    //                 }
    //             }, 50);
    //         }());
    //     }
    // });
    //
    // function turnTableGo() {
    //     turnTable.scene.getObjectByName("turntableBig").rotation.y = startTurnY + (move - startAction) * direction * step;
    // }
});
