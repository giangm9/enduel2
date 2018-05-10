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

eval("const get = $.get;\nvar RoomStatus = null;\nvar imgLock, pRoomID, playerList, btnEsc;\nvar socket;\n\n$(function() {\n  playerList    = $(\"#player-list\");\n  imgLock       = $(\"#img-lock\");\n  pRoomID       = $(\"#p-room-id\");\n  btnQuit       = $(\"#quit\");\n\n  updateRoomStatus();\n//  initBan();\n  initLock();\n  initQuit();\n  initSocket();\n})\n\nfunction initSocket(){\n  socket = io();\n}\n\nfunction initQuit(){\n  btnQuit.click (function(){\n    btnQuit.attr(\"disabled\", \"disabled\");\n    get(\"/room/leave\", function(data){\n      console.log(data);\n      location.reload();\n    });\n  });\n}\n\nfunction updateRoomStatus() {\n  $.get(\"/room/status\", function(data){\n    RoomStatus = data;\n    console.log(data);\n    render();\n  });\n}\n\n//  function initBan(){\n//    $(\".btn-ban\").hover(\n//        function() {\n//          console.log('hover in');\n//          $(this).css(\"opacity\", \"1.0\");\n//        }, \n//        function(){\n//          console.log('hover out');\n//          $(this).css(\"opacity\", \"0.5\");\n//        }\n//      );\n//  }\n\nfunction initLock(){\n  imgLock.click(function() {\n    imgLock.css(\"opacity\", 0.2);\n    $.get(\"/room/toggle-lock\", function(lock){\n        imgLock.css(\"opacity\", 1);\n        RoomStatus.lock = lock;\n        render();\n      });\n  });\n}\n\n\nfunction render(){\n\n  imgLock.attr(\"src\", RoomStatus.lock ? \"img/lock.png\" : \"img/unlock.png\");\n  pRoomID.text(\"ROOM ID : \" + RoomStatus.id);  \n  playerList.html('');\n  RoomStatus.players.forEach(function(player){\n    var index = RoomStatus.players.indexOf(player);\n    var template = [\"<div class='player'>\",\n        \"<div class='player-wrapper limit-width'>\"]\n    if (player.isHost){\n      template.push(\"<img class='img-crown' src='img/crown.png'/>\");\n    } else {\n      template.push(\"<img class='img-crown' style='opacity: 0' src='img/crown.png'/>\");\n    }\n    template.push(\"<p class='p-name'>\" + player.name + \"</p>\");\n    if (!player.isHost){\n      template.push(\"<button class='btn-ban' style=\" \n        + (index % 2 == 1 ? \"'background: white;\" : \"'background : #DDD;\")\n        + \"font-size: 2.5vmin'\"\n        + \"value='\" + player.id + \"'> kick </button>\")\n    }\n    template.push(\"</div>\", \"</div>\");\n    playerList.append(template.join(\"\\n\"));\n  });\n}\n\n\n//# sourceURL=webpack:///./public/src/room.js?");

/***/ })

/******/ });