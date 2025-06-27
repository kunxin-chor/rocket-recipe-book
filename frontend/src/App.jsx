import React from 'react';
import { Router, Route, Switch } from 'wouter';
import 'bootstrap/dist/css/bootstrap.min.css';

import LandingPage from './pages/LandingPage';
import RecipePage from './pages/RecipePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import LoginPage from './pages/LoginPage';
import CreateRecipe from './pages/CreateRecipe';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import "./App.css"

function App() {
  return (
    <div className="App">
      <Navbar />      
        <Router>
          <Switch>
            <Route path="/" component={LandingPage} />
            <Route path="/recipes" component={RecipePage} />
            <Route path="/recipe/:id" component={RecipeDetailPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/create-recipe" component={CreateRecipe} />
            {/* We'll add more routes as we build them */}
          </Switch>
        </Router>
    <Footer />
    </div>
  );
}

export default App;