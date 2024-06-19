import React, {useState, useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = ({path = "login"}) => {
    const [count, setCount] = useState(5)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevValue) => --prevValue)
        }, 1000)

        count === 0 && navigate(`/${path}`, {
            state: location.pathname
        })
        return () => clearInterval(interval)
    }, [count, navigate, location, path])
  return (
    <>
      <div class="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1 className="Text-center">redirect to you in {count} second</h1>
        <div>
        <div class="spinner-grow text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-secondary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-success" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-danger" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-warning" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-info" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-light" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="spinner-grow text-dark" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        </div>
      </div>
    </>
  );
};

export default Spinner;
