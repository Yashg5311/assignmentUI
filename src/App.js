import "./App.css";
import UsersList from "./Components/UserList";
import { ErrorBoundary } from "./ErrorHandling/ErrorBoundary";

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <UsersList />
      </ErrorBoundary>
    </div>
  );
}

export default App;
