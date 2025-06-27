import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>Recipe Book</h5>
            <p>Your go-to place for delicious recipes.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <p>&copy; {new Date().getFullYear()} Recipe Book. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;