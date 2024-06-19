import React from "react";
import Layout from "../../components/Layout/Layout";
import NurseMenu from "../../components/Layout/NurseMenu";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <Layout title={"User Dashboard"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <NurseMenu />
          </div>
          <div className="col-md-9">
            <section className="vh-100" style={{ backgroundColor: "#f4f5f7" }}>
              <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                  <div className="col col-lg-6 mb-4 mb-lg-0">
                    <div
                      className="card mb-3"
                      style={{ borderRadius: ".5rem" }}
                    >
                      <div className="row g-0">
                        <div
                          className="col-md-4 gradient-custom text-center text-white"
                          style={{
                            borderTopLeftRadius: ".5rem",
                            borderBottomLeftRadius: ".5rem",
                          }}
                        >
                          <img
                            src="https://img.freepik.com/free-psd/3d-icon-social-media-app_23-2150049569.jpg?w=740&t=st=1718742697~exp=1718743297~hmac=264fd88c1400741705edb5c5fc3588a042e6e06fd0acfcf4bb6ccb7aa9066d9e"
                            alt="Avatar"
                            className="img-fluid my-5"
                            style={{ width: 80 }}
                          />
                          <h5 className="text-dark">{auth?.user?.username}</h5>
                          <p className="text-dark">Medical Personel</p>
                          <i className="far fa-edit mb-5" />
                        </div>
                        <div className="col-md-8">
                          <div className="card-body p-4">
                            <h6>Information</h6>
                            <hr className="mt-0 mb-4" />
                            <div className="row pt-1">
                              <div className="col-6 mb-3">
                                <h6>Email</h6>
                                <p className="text-muted">{auth?.user?.email}</p>
                              </div>
                              <div className="col-6 mb-3">
                                <h6>Phone</h6>
                                <p className="text-muted">{auth?.user?.contact}</p>
                              </div>
                            </div>
                            <h6>Projects</h6>
                            <hr className="mt-0 mb-4" />
                            <div className="row pt-1">
                              <div className="col-6 mb-3">
                                <h6>Recent</h6>
                                <p className="text-muted">Lorem ipsum</p>
                              </div>
                              <div className="col-6 mb-3">
                                <h6>Most Viewed</h6>
                                <p className="text-muted">Dolor sit amet</p>
                              </div>
                            </div>
                            <div className="d-flex justify-content-start">
                              <a href="#!">
                                <i className="fab fa-facebook-f fa-lg me-3" />
                              </a>
                              <a href="#!">
                                <i className="fab fa-twitter fa-lg me-3" />
                              </a>
                              <a href="#!">
                                <i className="fab fa-instagram fa-lg" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
