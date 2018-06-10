import App from './src/App';
import appConfig from './appConfig';

App.listen(appConfig.instance.port['$'], () => {
    console.log(`${appConfig.instance.app} started at port ${appConfig.instance.port['$']} `)
});