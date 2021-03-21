import ApolloProvider from './ApolloProvider'
import { Route, Switch } from 'react-router'
import Home from './pages/Home'
import Register from './pages/Register'
import Signin from './pages/Signin'

function App() {
  return (
    <ApolloProvider>
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/signin" component={Signin} />
        <Route path="/" exact component={Home} />
      </Switch>
    </ApolloProvider>
  )
}

export default App
