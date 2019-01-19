export const routerRootPath = process.env.NODE_ENV === 'production' ? '/install/' : '/';

export const routerPaths = {
    install: {
        path:   'install',
        title:  '安装'
    },

    notFound: {
        path:   'notFound',
        title:  '404'
    }
};