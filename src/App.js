import Background from './components/Background/Background';
import Routes from './routes';
import img from './assets/images/clockwork-gears.jpg';
import './App.css';

function App() {
  return (
    <div className="App">
      <Background background={`url(${img})`} />
      <Routes />
    </div>
  );
}

export default App;
