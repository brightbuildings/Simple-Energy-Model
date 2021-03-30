import Header from "./components/Header";
import { Content } from "./components/Content";
import Footer from "./components/Footer";
import ErrorBoundary from './components/ErrorBoundary';

import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <ErrorBoundary>
        <Content />
      </ErrorBoundary>
      <Footer />
    </div>
  );
}

export default App;
