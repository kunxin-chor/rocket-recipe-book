import React from 'react';
import { Link } from 'wouter';

function LandingPage() {
  return (
    <div className="container mt-5">
      <div className="jumbotron text-center">
        <img
          src="https://picsum.photos/id/292/600/250"
          alt="Delicious recipe"
          className="img-fluid rounded mb-4"
          style={{ maxHeight: '250px', objectFit: 'cover', width: '100%' }}
        />
        <h1 className="display-4">Welcome to Recipe Book</h1>
        <p className="lead">Discover, create, and share your favorite recipes!</p>
        <hr className="my-4" />
        <p>Join our community of food enthusiasts and start your culinary journey today.</p>
        <Link href="/register" className="btn btn-primary btn-lg">Get Started</Link>
      </div>
    </div>
  );
}

export default LandingPage;