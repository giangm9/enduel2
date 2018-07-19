gen-tags:
	ctags -R --exclude=.git --exclude=node_modules --exclude=public/dist

webpack:
	webpack --watch

test:
	npm test

start-server:
	mv log.txt log.old.txt
	node main.js > log.txt
