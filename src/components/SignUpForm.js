import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Input from "./common/Input";
import RadioInput from "./common/RadioInput";
import Select from "./common/SelectComponent";
import CheckBoxInput from "./common/CheckBoxInput";

const checkBoxOptions = [
  { label: "fa", value: "fa" },
  { label: "eng", value: "eng" },
];

const radioOptions = [
  { label: "male", value: "0" },
  { label: "female", value: "1" },
];

const selectOptions = [
  { label: "select nationality ...", value: "" },
  { label: "Iran", value: "IR" },
  { label: "Germany", value: "GER" },
  { label: "USA", value: "US" },
];

const initialValues = {
  name: "",
  email: "",
  phoneNumber: "",
  password: "",
  passwordConfirmation: "",
  gender: "",
  nationality: "",
  lang: [],
  terms: false,
};

const onSubmit = (values) => {
  console.log({ ...values, newData: "6 may 1995" });
  axios
    .post("http://localhost:3001/users", values)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => console.log(err));
};

const validationSchema = Yup.object({
  name: Yup.string()
    .required("name is required")
    .min(6, "name length is not valid"),
  email: Yup.string()
    .email("invalid email format")
    .required("email is required"),
  phoneNumber: Yup.string()
    .required("phone number is required")
    .matches(/^[0-9]{11}$/, `invalid phone number`)
    .nullable(),
  password: Yup.string().required("password is required"),
  passwordConfirmation: Yup.string()
    .required("password confirmation is required")
    .oneOf([Yup.ref("password"), null], "Password must match"),
  gender: Yup.string().required("gender is required"),
  nationality: Yup.string().required("select nationality"),
  lang: Yup.array().min(1).required("at least select one experience"),
  terms: Yup.boolean()
    .required("the terms and conditions be accepted.")
    .oneOf([true], "the terms and conditions must be accepted"),
});

const SignUpForm = () => {
  const [formValues, setFormValues] = useState(null);
  const formik = useFormik({
    initialValues: formValues || initialValues,
    onSubmit,
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/users/1")
      .then((res) => setFormValues(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="form">
      <h2>Info</h2>
      <form onSubmit={formik.handleSubmit}>
        <Input formik={formik} name="name" label="name" />
        <Input formik={formik} name="email" label="Email" />
        <Input formik={formik} name="phoneNumber" label="phone-number" />
        <Input
          formik={formik}
          name="password"
          label="Password"
          type="password"
        />
        <Input
          formik={formik}
          name="passwordConfirmation"
          label="Password confirmation"
          type="password"
        />
        <RadioInput formik={formik} radioOptions={radioOptions} name="gender" />
        <Select
          selectOptions={selectOptions}
          name="nationality"
          formik={formik}
        />
        <CheckBoxInput
          formik={formik}
          checkBoxOptions={checkBoxOptions}
          name="lang"
        />
        <input
          type="checkbox"
          id="terms"
          name="terms"
          value={true}
          onChange={formik.handleChange}
          checked={formik.values.terms}
        />
        <label htmlFor="terms">terms and conditions</label>
        {formik.errors.terms && formik.touched.terms && (
          <div className="error">{formik.errors.terms}</div>
        )}
        <button type="submit" disabled={!formik.isValid}>
          submit
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
