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
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/src/login.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/src/dice.js":
/*!****************************!*\
  !*** ./public/src/dice.js ***!
  \****************************/
/*! exports provided: InitDice */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"InitDice\", function() { return InitDice; });\nvar fps     = 30.0,\n    nFrame  = 80.0,\n    stop    = 0.9,\n    time    = 0.0,\n    next    = 0.9,\n    high    = false,\n    state   = \"idle\",\n    urlNorm = \"img/norm.jpg\",\n    urlHigh = \"img/high.jpg\",\n    last    = null,\n    canvas  = null,\n    context = null,\n    imgNorm = null,\n    imgHigh = null,\n    click   = null, \n    finish  = null;\n\nfunction InitDice($canvas, click, finishcb) {\n  canvas      = $canvas[0];\n  context     = canvas.getContext('2d');\n  imgNorm     = new Image();\n  imgHigh     = new Image();\n  imgNorm.src = urlNorm;\n  imgHigh.src = urlHigh;\n  click       = click;\n  finish      = finishcb;\n\n  $canvas.hover(\n    function() {\n      high = true;\n    },\n    function() {\n      high = false;\n    }\n  ).click(\n    function() {\n      state = \"spin\";\n      click();\n    }\n  );\n  step();\n}\n\nfunction step(timestamp) {\n  requestAnimationFrame(step);\n\n  if (!last) last = timestamp;\n\n  if (state == \"spin\") {\n    time += (timestamp - last) * 0.001;\n\n    if (time > next) {\n        finish();\n      state = \"idle\";\n      next += stop;\n    }\n  }\n\n  var index = Math.floor(time * fps) % nFrame;\n  render(index);\n  last = timestamp;\n\n}\n\nfunction render(index) {\n  var width  = 100;\n  var height = 100;\n  var nRow   = 8;\n  var nCol   = 10;\n  var row    = Math.floor(index / nCol);\n  var col    = index % nCol;\n  var startX = col * width;\n  var startY = row * height;\n\n  context.drawImage(\n    high ? imgHigh : imgNorm,\n    startX, startY,\n    width, height,\n    0, 0,\n    canvas.width,\n    canvas.height\n  )\n\n} \n\n\n\n\n//# sourceURL=webpack:///./public/src/dice.js?");

/***/ }),

/***/ "./public/src/login.js":
/*!*****************************!*\
  !*** ./public/src/login.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _dice__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dice */ \"./public/src/dice.js\");\n\n\nconst Get = $.get;\nconst LOG = console.log;\nvar $RoomID, \n    $Join,\n    $Start, \n    $Name, \n    $Warning;\n    name;\n\n$(function() {\n  $RoomID  = $(\"#inp-roomid\");\n  $Join    = $(\"#btn-join\");\n  $Start   = $(\"#btn-start\");\n  $Name    = $(\"#inp-name\");\n  $Warning = $(\"#warning\");\n\n  Object(_dice__WEBPACK_IMPORTED_MODULE_0__[\"InitDice\"])($(\"#cdice\"), GenName, SetName );\n  InitCreate();\n  InitInputName();\n  InitJoin();\n})\n\nfunction InitJoin(){\n  $Join.click(function() {\n    if (!ValidateName()) return;\n    Get(\"/login/join\", \n      {\n        room: $RoomID.val(),\n        name: $Name.val()\n      }, \n      function(data){\n        if (data ==  \"not-found\"){\n        $Warning.text(\"Can't find room ID\");\n      } else {\n        location.reload();\n      }\n    });\n  });\n}\n\nfunction InitInputName(){\n  name = Cookies.get(\"name\");\n  $Name.val(name === undefined ? name : '');\n  $RoomID.on(\"input\", function() {\n    if ($RoomID.val() == \"\") {\n      $Join.text(\"JOIN RANDOM\");\n    } else {\n      $Join.text(\"JOIN\");\n    }\n  });\n  \n  $Name.on(\"input\", function(){\n    $Warning.html(\"&nbsp\");\n  });\n\n}\n\nfunction InitCreate(){\n  $Start.click(function(){\n    if (!ValidateName()) return;\n    Get(\"/login/create-room\", \n        { name: name },\n        function(data){\n          location.reload();\n        }\n    );\n  });\n}\n\nfunction GenName() {\n  $Warning.html(\"&nbsp\");\n  Get(\"login/gen-name\", function( data ){\n      name = data;\n      Cookies.set(\"name\", name);\n  });\n}\n\nfunction SetName() {\n  $Name.val(Cookies.get(\"name\"));\n}\n\nfunction ValidateName(){\n  if ($Name.val() == '') {\n    $Warning.text(\"Name must be filled\");\n    return false;\n  } \n  return true;\n}\n\n\n//# sourceURL=webpack:///./public/src/login.js?");

/***/ })

/******/ });