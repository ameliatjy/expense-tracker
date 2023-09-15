import Home from "./pages/Home";

import DarkModeProvider from "./contexts/DarkModeProvider";
import ExpenseKeysProvider from "./contexts/ExpenseKeysProvider";
import SortedColumnProvider from "./contexts/SortedColumnProvider";

import './App.css';

function App() {
  return (
    <div className="App">
      <DarkModeProvider>
        <ExpenseKeysProvider>
          <SortedColumnProvider>
            <Home />
          </SortedColumnProvider>
        </ExpenseKeysProvider>
      </DarkModeProvider>
    </div>
  );
}

export default App;
