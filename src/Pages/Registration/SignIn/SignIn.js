import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../Contexts/AuthProvider";

const SignIn = () => {
  let navigate = useNavigate();
  let location = useLocation();
  let from = location.state?.from?.pathname || "/";

  // error message storage
  const [loginError, setLoginError] = useState("");

  //get Authentication function
  const { logIN, googleLogIn, setLoading, createJWT } = useAuth();

  // get From-hook function
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  // Login From submit or user Login handel
  const onSubmit = (data) => {
    setLoginError("");
    logIN(data.email, data.password)
      .then(() => {
        createJWT(data.email);
        reset();
        navigate(from, { replace: true });
      })
      .catch((error) => {
        const errorMessage = error.message.split("/")[1].split(")");
        setLoginError(errorMessage[0]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Google login handel
  const handelGoogleLogin = () => {
    googleLogIn()
      .then((result) => {
        if (result?.user?.uid) {
          userInfo(result.user.displayName, result.user.email);
        }
      })
      .catch((error) => {
        const errorMessage = error?.message?.split("/")[1];
        setLoginError(errorMessage?.split(")")[0]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // save user info on DB
  const userInfo = (name, email) => {
    const userinfo = { name, email };
    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(userinfo),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledged) {
          createJWT(email);
          navigate(from, { replace: true });
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className='md:my-6 my-3 mx-2'>
      <div className='card w-full max-w-md mx-auto shadow-md rounded-xl'>
        <form onSubmit={handleSubmit(onSubmit)} className='card-body pt-1'>
          <h3 className='text-xl text-center'>Login Now!</h3>
          {loginError && (
            <p className='text-error mt-1 capitalize text-center font-semibold'>
              {loginError}
            </p>
          )}

          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>Email</span>
            </label>
            <input
              type='email'
              className='input input-bordered'
              {...register("email", { required: "Email Address is required" })}
            />
            {errors.email && (
              <p className='text-error mt-1' role='alert'>
                {errors.email?.message}
              </p>
            )}
          </div>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>Password</span>
            </label>
            <input
              type='password'
              className='input input-bordered'
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password Length Must be 6 Characters",
                },
              })}
            />
            {errors.password && (
              <p className='text-error mt-1' role='alert'>
                {errors.password?.message}
              </p>
            )}
            <label className='label'>
              <Link className='label-text-alt link link-hover'>
                Forgot password?
              </Link>
            </label>
          </div>

          <div className='form-control mt-2'>
            <input className='btn btn-accent' type='submit' value='Login' />
            <label className='label'>
              <p className='text-center'>
                New to Doctors Portal?{" "}
                <Link
                  to='/register'
                  className='link link-hover text-center text-secondary'>
                  Create new account
                </Link>
              </p>
            </label>
          </div>

          <div className='divider'>OR</div>
          <span
            onClick={handelGoogleLogin}
            className='btn btn-outline btn-accent'>
            CONTINUE WITH GOOGLE
          </span>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
