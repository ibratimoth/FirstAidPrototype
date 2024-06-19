import React,{ useState } from "react";
import Layout from "../../components/Layout/Layout";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCheckbox,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()
    const [auth, setAuth] = useAuth()
    const location = useLocation()
    //form function
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('http://localhost:8082/api/v1/auth/login', {email, password})
            if(res.data.success){
                toast.success(res.data.message)
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token
                })
                localStorage.setItem('auth', JSON.stringify(res.data))
                navigate(location.state || '/')
            }else{
                toast.error(res.data.message)

            }
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong')
        }
    setEmail("");
    setPassword("");
    }
  return (
    <Layout title={"Login here"}>
      <MDBContainer fluid className="mt-5">
        <section className="background-radial-gradient overflow-hidden">
          <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
            <div className="row gx-lg-5 align-items-center mb-5">
              <div className="col-lg-6 mb-5 mb-lg-0" style={{ zIndex: 10 }}>
                <h1
                  className="my-5 display-3 fw-bold ls-tight"
                  style={{ color: "hsl(218°, 2%, 21%)" }}
                >
                  SLF <br />
                  <span style={{ color: "#1c2129" }}>Aid Application</span>
                </h1>
                <p
                  className="mb-4 opacity-70"
                  style={{ color: "hsl(218°, 2%, 21%)" }}
                >
                 "Every small act of kindness has the power to change a life. By stepping in to provide first aid, you become a beacon of hope and a hero in someone's moment of need. Your courage and compassion can make all the difference.
                </p>
              </div>

              <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
                <div
                  id="radius-shape-1"
                  className="position-absolute rounded-circle shadow-5-strong"
                ></div>
                <div
                  id="radius-shape-2"
                  className="position-absolute shadow-5-strong"
                ></div>

                <div className="card bg-glass">
                  <div className="card-body px-4 py-5 px-md-5">
                    <form onSubmit={handleSubmit}>
                      <MDBInput
                        className="mb-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        id="loginName"
                        label="Email or username"
                      />

                      <MDBInput
                        className="mb-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        id="loginPassword"
                        label="Password"
                      />

                      <MDBRow className="mb-4">
                        <MDBCol
                          md="6"
                          className="d-flex justify-content-center"
                        >
                          <MDBCheckbox
                            className=" mb-3 mb-md-0"
                            defaultChecked
                            label=" Remember me"
                          />
                        </MDBCol>

                        <MDBCol
                          md="6"
                          className="d-flex justify-content-center"
                          text-dark
                        >
                          <a href="#!" class="link-dark">Forgot password?</a>
                        </MDBCol>
                      </MDBRow>

                      <MDBBtn
                        type="submit"
                        block
                        className="mb-4"
                        color="danger"
                      >
                        Sign in
                      </MDBBtn>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </MDBContainer>
    </Layout>
  );
};

export default Login;
