import React from 'react';

export default function TryIt({ img, setTryIt, width }) {
  return (
    <div className="col-12 my-3">
      <div className="card shadow-lg p-4">
        <div className="card-body text-center">
          <img
            src={img}
            className="img-fluid rounded"
            style={{
              maxHeight: '500px',
              width: 'auto',
              maxWidth: '100%',
              objectFit: 'contain',
            }}
            alt="Preview"
          />
        </div>
        <div className="card-footer text-center bg-white">
          <button
            type="button"
            className="btn btn-success px-4 py-2 m-1"
            onClick={() => setTryIt(false)}
            style={{
              maxWidth: '300px',
              width: '50%',
              transition: 'all 0.3s ease',
            }}
          >
            Try it
            <i className="ms-2 fa-solid fa-money-bill-transfer"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
