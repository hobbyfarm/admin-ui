import pkg from '../../package.json';

export const environment = {
    production: true,
    server: 'http://localhost:8080',
    version: pkg.version
};
