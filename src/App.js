import Home from "./pages/home";

import DarkModeProvider from "./contexts/DarkModeProvider";
import ExpenseKeysProvider from "./contexts/ExpenseKeysProvider";

import './App.css';

function App() {
  return (
    <div className="App">
      <DarkModeProvider>
        <ExpenseKeysProvider>
          <Home />
        </ExpenseKeysProvider>
      </DarkModeProvider>
    </div>
  );
}

export default App;
