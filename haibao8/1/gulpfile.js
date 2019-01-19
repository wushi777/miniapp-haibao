const gulp 			= require('gulp');
const ts 			= require('gulp-typescript');
const sourcemaps 	= require('gulp-sourcemaps');

//TypeScript编译选项
const tsOptions = {
	/*
	libs: [
		'es2017'
	],
	*/

	//isolatedModules: 			true,

	noFallthroughCasesInSwitch: true,
	noImplicitReturns:			true,
	noImplicitThis: 			true,
	noImplicitUseStrict:		true,
	//noImplicitAny:			true,

	module: 					'commonjs',
	target: 					'es2017',
	removeComments: 			true,
	pretty:						true,
	skipLibCheck: 				true
};

const compileServerTask	= 'compileServer';
const copyServerTask	= 'copyServer';
const compileClientTask	= 'compileClient';
const copyClientTask	= 'copyClient';

const allTasks = [
	compileServerTask,
	copyServerTask,
	compileClientTask,
	copyClientTask
];

//////////////////////////////////////////////////////////////////

////编译 Server
const tsServerProject = ts.createProject(tsOptions);

//编译服务器的 TypeScript 文件
gulp.task(compileServerTask, () => {
   return gulp.src('./src/server/**/*.ts')
       .pipe(sourcemaps.init({loadMaps: true, debug: true}))
       .pipe(tsServerProject())
       .pipe(sourcemaps.write('./', {sourceRoot: '../../src/server/'}))
       .pipe(gulp.dest('./bin/server'));
});

gulp.task(copyServerTask, () => {
	return gulp.src(['./src/server/**/*.*', '!./src/server/**/*.ts'])
		.pipe(gulp.dest('./bin/server'));
});

//////////////////////////////////////////////////////////////////

////编译 Client
const tsClientProject = ts.createProject(tsOptions);

//编译 Client 的 TypeScript 文件
gulp.task(compileClientTask, () => {
   return gulp.src('./src/client/**/*.ts')
       .pipe(sourcemaps.init({loadMaps: true, debug: true}))
       .pipe(tsClientProject())
       .pipe(sourcemaps.write('./', {sourceRoot: '../../src/client/'}))
       .pipe(gulp.dest('./bin/client'));
});

gulp.task(copyClientTask, () => {
	return gulp.src(['./src/client/**/*.*', '!./src/client/**/*.ts'])
		.pipe(gulp.dest('./bin/client'));
});

///////////////////////////////////////////////////////////////////////

gulp.task('copyApiTypes', () => {
	gulp.src('./src/server/utils/ApiTypes.ts')
		.pipe(gulp.dest('./src/client/api'));	

	gulp.src('./src/server/utils/ApiTypes.ts')
		.pipe(gulp.dest('./src/web/admin/src/api'));

	gulp.src('./src/server/utils/ApiTypes.ts')
		.pipe(gulp.dest('./src/web/install/src/api'));
});

gulp.task('watchServer', [compileServerTask, copyServerTask], () => {
	gulp.watch('./src/server/**/*.ts', 								[compileServerTask]);
	gulp.watch(['./src/server/**/*.*', '!./src/server/**/*.ts'], 	[copyServerTask]);
});

gulp.task('watchClient', [compileClientTask, copyClientTask], () => {
	gulp.watch('./src/client/**/*.ts', 								[compileClientTask]);
	gulp.watch(['./src/client/**/*.*', '!./src/client/**/*.ts'], 	[copyClientTask]);
});

gulp.task('buildClient', [compileClientTask, copyClientTask], () => {
	process.exit();
});

gulp.task('buildServer', [compileServerTask, copyServerTask], () => {
	process.exit();
});

gulp.task('buildall', allTasks, () => {
	process.exit();
});

gulp.task('default', allTasks, () => {
	gulp.watch('./src/server/**/*.ts', 								[compileServerTask]);
	gulp.watch(['./src/server/**/*.*', '!./src/server/**/*.ts'], 	[copyServerTask]);
	gulp.watch('./src/client/**/*.ts', 								[compileClientTask]);
	gulp.watch(['./src/client/**/*.*', '!./src/client/**/*.ts'], 	[copyClientTask]);
});