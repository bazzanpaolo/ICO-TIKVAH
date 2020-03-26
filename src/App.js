import React from 'react';
import './App.css';

function App() {
  return (
    <div className="container">
    <h1>White Paper</h1>
    <a href="jwf-whitepaper-az.pdf">
      White Paper
    </a>
    <div className="top-bar">
  <button className="btn" id="prev-page">
    <i className="fas fa-arrow-circle-left"></i> Prev Page
  </button>
  <button className="btn" id="next-page">Next Page
    <i className="fas fa-arrow-circle-left"></i>
  </button>
  <span className="page-info">
    Page <span id="page-num"></span> of <span id="page-count"></span>
  </span>
</div>

<canvas id="the-canvas"></canvas>
<script src="https://mozilla.github.io/pdf.js/build/pdf.js"></script>
<script src="js/main.js"></script>


    </div>
  );
}

export default App;
