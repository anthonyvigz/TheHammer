import React, { useState } from "react";
import "./login.scss";
import * as Yup from "yup";
import { Formik } from "formik";
import { motion } from "framer-motion";
import Error from "./Error";
import IncorrectLogin from "./IncorrectLogin";
import axios from "axios";
import { TextField, Button, CircularProgress, Box } from "@material-ui/core";

export default function Login(props) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

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
          setLoading(true)

          const { password } = values;
          axios
            .post("https://the-pavilion-hammer.herokuapp.com/user/login", {
              password: password,
            })
            // successful login prompts to main page
            .then((res) => {
              setLoading(false);
              localStorage.setItem("token", res.data.token);
              setTimeout(() => {
                props.history.push("/dashboard");
              }, 500);
            })
            .catch((err) => {
              setError(true);
              setLoading(false);
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
            <h1>Jacinto</h1>
            <h2>enter the password:</h2>
            <TextField
              id="outlined-basic"
              variant="outlined"
              type="password"
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
            <Button variant="contained" color="primary" type="submit">login</Button>
          </form>
        )}
      </Formik>
      <Box height="25px"></Box>
      {loading ? <CircularProgress /> : null}
      <IncorrectLogin error={error} />
    </motion.div>
  );
}
