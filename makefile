gen-tags:
	ctags -R --exclude=.git --exclude=node_modules --exclude=public/dist

start:
	node main.js

webpack:
	webpack --watch

test:
	npm test
