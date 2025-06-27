import React from 'react';
import { Link } from 'wouter';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link href="/" className="navbar-brand">Recipe Book</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link href="/recipes" className="nav-link">Recipes</Link>
            </li>
            <li>
              <Link href="/create-recipe" className="nav-link">Create Recipe</Link>
            </li>
            <li className="nav-item">
              <Link href="/login" className="nav-link">Login</Link>
            </li>
            <li className="nav-item">
              <Link href="/register" className="nav-link">Register</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;