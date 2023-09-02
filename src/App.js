import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login";
import HomePage from "./Components/HomePage";
import { useEffect } from "react";
import { getUserAuth } from "./actions";
import { connect } from "react-redux";//The connect function connects the React component to the Redux store, enabling the component to access Redux state and dispatch actions.

function App(props) {
  useEffect(() => {
    props.getUserAuth();//This dispatches the action to check the user's authentication status.
  
  }, []); //will only run once when the component mounts
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </div>
  );
}

// It is used to map the Redux state to the component's props
const mapStateToProps = (state) => {
  return {}
}

//. It maps the getUserAuth function to the component's props so that it can be used as props.getUserAuth() to dispatch the getUserAuth action.
const mapDispatchToProps = (dispatch) => ({
  getUserAuth: () => dispatch(getUserAuth()),
 
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
//This line exports the App component after connecting it to the Redux store using the connect function. By doing this, the App component can access Redux state and dispatch actions using the provided props.