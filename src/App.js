import './App.css';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <nav className="App-nav">
        <a href="#ai-art-portfolio" className="App-link">AI Art Portfolio</a>
        <a href="#projects-portfolio" className="App-link">Projects Portfolio</a>
        <a href="#sref-seedvault" className="App-link">SREF SeedVault</a>
      </nav>
      <header className="App-header">
        <Home />
      </header>
    </div>
  );
}

export default App;
