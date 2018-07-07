gen-tags:
	ctags -R --exclude=.git --exclude=node_modules --exclude=public/dist

webpack:
	webpack --watch

test:
	npm test
