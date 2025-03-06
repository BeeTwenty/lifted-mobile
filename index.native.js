
import { AppRegistry } from 'react-native';
import App from './src/App.native';

AppRegistry.registerComponent('Lifted', () => App);

// Register for web as well
if (typeof document !== 'undefined') {
  const rootTag = document.getElementById('root');
  AppRegistry.runApplication('Lifted', { rootTag });
}
