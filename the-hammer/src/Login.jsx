import React, { useState } from "react";
import "./login.scss";
import * as Yup from "yup";
import { Formik } from "formik";
import { motion } from "framer-motion";
import Error from "./Error";
import IncorrectLogin from "./IncorrectLogin";
import axios from "axios";

export default function Login(props) {
  /// loader state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(1, "Must enter a password")
      .required("Password is required"),
  });

  return (
    <motion.div
      exit={{ opacity: 0 }}
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: "-50%" }}
      className="login"
    >
      <Formik
        initialValues={{
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          setLoading(true);

          const { password } = values;
          axios
            .post("https://the-pavilion-hammer.herokuapp.com/user/login", {
              password: password,
            })
            // successful login prompts to main page
            .then((res) => {
              setLoading(false);
              console.log(res.data);
              localStorage.setItem("token", res.data.token);
              setTimeout(() => {
                props.history.push("/algos");
              }, 500);
            })
            .catch((err) => {
              setLoading(false);
              console.log(err);
              setError(true);
              setTimeout(() => {
                setError(false);
              }, 3000);
            });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit} className="loginForm">
            <h2>enter the password:</h2>
            <input
              type="password"
              id="password"
              placeholder=""
              name="password"
              onChange={handleChange}
              value={values.email}
              onBlur={handleBlur}
              className={
                touched.password && errors.password ? "hasError" : "validInput"
              }
            />
            <Error touched={touched.password} message={errors.password} />
            <button type="submit">login</button>
          </form>
        )}
      </Formik>
      <IncorrectLogin error={error} />
    </motion.div>
  );
}
