import React from 'react';

function Footer() {
  return (
    <footer className="bg-body-tertiary text-center mt-5">
      <div className="container p-4 pb-0">
        <section className="mb-4">
          <a
            data-mdb-ripple-init
            className="btn text-white btn-floating m-1 btn-facebook"
            style={{ backgroundColor: '#3b5998' }}
            href="https://www.facebook.com/people/lavazza_morocco/100064022233162/"
            role="button"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
         
          <a
            data-mdb-ripple-init
            className="btn text-white btn-floating m-1 btn-google"
            style={{ backgroundColor: '#dd4b39' }}
            href="/"
            role="button"
          >
            <i className="fab fa-google"></i>
          </a>
          <a
            data-mdb-ripple-init
            className="btn text-white btn-floating m-1 btn-instagram"
            style={{ backgroundColor: '#ac2bac' }}
            href="https://www.instagram.com/lavazza.maroc/p/CpHqqg7I4GO/"
            role="button"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            data-mdb-ripple-init
            className="btn text-white btn-floating m-1 btn-linkedin"
            style={{ backgroundColor: '#0082ca' }}
            href="https://www.linkedin.com/company/topclass-expresso"
            role="button"
          >
            <i className="fab fa-linkedin-in"></i>
          </a>
        </section>
      </div>
      <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2024 Copyright: 
        <a className="text-body" href="https://Topclass.ma/"> Topclass.ma </a>
      </div>
    </footer>
  );
}

export default Footer;
