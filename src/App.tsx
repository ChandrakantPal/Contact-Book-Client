import { Route, Switch } from 'react-router'
import Home from './pages/Home'
import Register from './pages/Register'
import Signin from './pages/Signin'

function App() {
  return (
    <Switch>
      <Route path="/register" component={Register} />
      <Route path="/signin" component={Signin} />
      <Route path="/" exact component={Home} />
    </Switch>
  )
}

export default App
