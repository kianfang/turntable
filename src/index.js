"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var Textures_1 = require("./lib/Textures");
var Turntable_1 = require("./lib/Turntable");
var $ = require("jquery");
var dat = require("dat.gui/build/dat.gui.min.js");
$(function () { return __awaiter(_this, void 0, void 0, function () {
    var $turntable, textures, maps, _a, turnTable, gui, guiOptions, centerMouseX, centerMouseY, startMouseX, startMouseY, targetRotationMouseStart, centerTouchX, centerTouchY, startTouchX, startTouchY, targetRotationTouchStart, startTime, endTime, step;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                $turntable = $("#turntable");
                textures = new Textures_1.Textures();
                _a = {};
                return [4 /*yield*/, textures.turntable()];
            case 1:
                maps = (_a.turntable = _b.sent(),
                    _a);
                turnTable = new Turntable_1.Turntable({
                    maps: maps,
                    width: $turntable.width(),
                    height: $turntable.height()
                });
                gui = new dat.GUI();
                guiOptions = {
                    "scene rotation y": turnTable.scene.rotation.y,
                    "camera position z": turnTable.camera.position.z,
                    "camera position y": turnTable.camera.position.y
                };
                (function render() {
                    turnTable.render();
                    requestAnimationFrame(render);
                }());
                gui.add(guiOptions, 'scene rotation y', 0, Math.PI * 2).onChange(function (value) { return turnTable.scene.rotation.y = value; });
                gui.add(guiOptions, 'camera position z', 0, 5000).onChange(function (value) { return turnTable.camera.position.z = value; });
                gui.add(guiOptions, 'camera position y', 0, 5000).onChange(function (value) { return turnTable.camera.position.y = value; });
                centerMouseX = $turntable.width() * 0.5;
                centerMouseY = $turntable.height() * 0.5;
                startMouseX = 0;
                startMouseY = 0;
                targetRotationMouseStart = 0;
                centerTouchX = $(window).width() * 0.5;
                centerTouchY = $(window).height() * 0.5;
                startTouchX = 0;
                startTouchY = 0;
                targetRotationTouchStart = 0;
                startTime = Date.now();
                endTime = Date.now();
                step = 0.1;
                $turntable.on("mousedown", function (e) {
                    var _this = this;
                    startMouseX = e.offsetX;
                    startMouseY = e.offsetY;
                    targetRotationMouseStart = turnTable.targetRotation;
                    $(this).on("mousemove", function (e) {
                        var moveX = e.offsetX - startMouseX;
                        var moveY = e.offsetY - startMouseY;
                        var val = (startMouseY - centerMouseY) * (e.offsetX - centerMouseX) - (startMouseX - centerMouseX) * (e.offsetY - centerMouseY);
                        var direction = val > 0 ? 1 : -1;
                        turnTable.targetRotation = targetRotationMouseStart + Math.sqrt(moveX * moveX + moveY * moveY) * step * direction;
                    });
                    $(this).on("mouseup mouseout", function (e) {
                        $(_this).off("mousemove mouseup mouseout");
                    });
                }).on("touchstart", function (e) {
                    var _this = this;
                    console.log(e);
                    startTouchX = e.touches[0].clientX;
                    startTouchY = e.touches[0].clientY;
                    console.log(startTouchX, startTouchY);
                    targetRotationTouchStart = turnTable.targetRotation;
                    $(this).on("touchmove", function (e) {
                        var moveX = e.touches[0].clientX - startTouchX;
                        var moveY = e.touches[0].clientY - startTouchY;
                        var val = (startTouchY - centerTouchY) * (e.touches[0].clientX - centerTouchX) - (startTouchX - centerTouchX) * (e.touches[0].clientY - centerTouchY);
                        var direction = val > 0 ? 1 : -1;
                        turnTable.targetRotation = targetRotationTouchStart + Math.sqrt(moveX * moveX + moveY * moveY) * step * direction;
                    });
                    $(this).on("touchend", function (e) {
                        $(_this).off("touchmove");
                    });
                });
                $turntable.children("canvas").on("mousemove", function (e) {
                    turnTable.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                    turnTable.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
                });
                return [2 /*return*/];
        }
    });
}); });
