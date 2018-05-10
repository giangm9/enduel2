/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/src/room.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/src/room.js":
/*!****************************!*\
  !*** ./public/src/room.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const Get = $.get;\nconst LOG = console.log;\n\nvar status = null,\n    $Lock, \n    $RoomID, \n    $PlayerList,\n    $Quit,\n    socket;\n\n$(function() {\n  $PlayerList = $(\"#player-list\");\n  $Lock       = $(\"#img-lock\");\n  $RoomID     = $(\"#p-room-id\");\n  $Quit       = $(\"#quit\");\n\n  updateRoomStatus();\n//  initBan();\n  initLock();\n  initQuit();\n  initSocket();\n})\n\nfunction initSocket(){\n  socket = io();\n}\n\nfunction initQuit(){\n  $Quit.click (function(){\n    $Quit.attr(\"disabled\", \"disabled\");\n    Get(\"/room/leave\", function(data){\n      console.log(data);\n      location.reload();\n    });\n  });\n}\n\nfunction updateRoomStatus() {\n  Get(\"/room/status\", function(data){\n    status = data;\n    LOG(data);\n    render();\n  });\n}\n\nfunction initLock(){\n  $Lock.click(function() {\n    $Lock.css(\"opacity\", 0.2);\n    Get(\"/room/toggle-lock\", function(lock){\n        $Lock.css(\"opacity\", 1);\n        status.lock = lock;\n        render();\n      });\n  });\n}\n\n\nfunction render(){\n\n  $Lock.attr(\"src\", status.lock ? \"img/lock.png\" : \"img/unlock.png\");\n  $RoomID.text(\"ROOM ID : \" + status.id);  \n  $PlayerList.html('');\n  if (!status) return;\n  status.players.forEach(function(player){\n    var index = status.players.indexOf(player);\n    var template = [\"<div class='player'>\",\n        \"<div class='player-wrapper limit-width'>\"]\n    if (player.isHost){\n      template.push(\"<img class='img-crown' src='img/crown.png'/>\");\n    } else {\n      template.push(\"<img class='img-crown' style='opacity: 0' src='img/crown.png'/>\");\n    }\n    template.push(\"<p class='p-name'>\" + player.name + \"</p>\");\n    if (!player.isHost){\n      template.push(\"<button class='btn-ban' style=\" \n        + (index % 2 == 1 ? \"'background: white;\" : \"'background : #DDD;\")\n        + \"font-size: 2.5vmin'\"\n        + \"value='\" + player.id + \"'> kick </button>\")\n    }\n    template.push(\"</div>\", \"</div>\");\n    $PlayerList.append(template.join(\"\\n\"));\n  });\n}\n\n\n//# sourceURL=webpack:///./public/src/room.js?");

/***/ })

/******/ });