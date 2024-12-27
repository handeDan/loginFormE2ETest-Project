import React, { useEffect, useState } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  FormFeedback,
} from "reactstrap";
import { useHistory } from "react-router-dom";
import axios from "axios";

const initialForm = {
  //başlangıçta formun ilk hali..
  email: "",
  password: "",
  terms: false,
};

const errorMessages = {
  email: "Please enter a valid email address",
  password:
    "Password must be at least 5 characters, at least one letter and one number",
};
export default function Login() {
  const [form, setForm] = useState(initialForm);
  const [isValid, setIsValid] = useState(false); // Form geçerli mi?
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    terms: false,
  });

  const history = useHistory();

  // E-posta geçerliliğini kontrol eden regex:
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };
  // password geçerliliğini kontrol eden regex:
  //Minimum 5 characters, at least one letter and one number:
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{5,}$/;
    return passwordRegex.test(password);
  };

  useEffect(() => {
    // Geçerlilik kontrolü:
    const emailValid = validateEmail(form.email);
    const passwordValid = validatePassword(form.password);
    const termsValid = form.terms;
    // Form geçerli mi?:
    setIsValid(emailValid && passwordValid && termsValid);
    // Hata durumlarını güncelle:
    setErrors({
      email: !emailValid,
      password: !passwordValid,
      terms: !form.terms,
    });
  }, [form]); // form değiştiğinde tetiklenir..

  const handleChange = (event) => {
    let { name, value, type } = event.target;
    value = type === "checkbox" ? event.target.checked : value;
    setForm({ ...form, [name]: value });
    console.log(errors);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Form geçerli değilse işlem yapma:
    if (!isValid) {
      return;
    }
    // API isteği ile login işlemi:
    axios
      .get("https://6540a96145bedb25bfc247b4.mockapi.io/api/login")
      .then((res) => {
        const user = res.data.find(
          (item) => item.password == form.password && item.email == form.email
        );
        if (user) {
          setForm(initialForm);
          history.push("/success");
        } else {
          history.push("/error");
        }
      })
      .catch((error) => {
        console.error(error);
        history.push("/error");
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Email Girişi: */}
      <FormGroup>
        <Label for="exampleEmail">Email</Label>
        <Input
          id="exampleEmail"
          name="email"
          placeholder="Enter your email"
          type="email"
          onChange={handleChange}
          value={form.email}
          invalid={errors.email} //hata varsa input invalid olacak..
        />
        {errors.email && <FormFeedback>{errorMessages.email}</FormFeedback>}
        {/* Email hatası */}
      </FormGroup>

      {/* Password Girişi: */}
      <FormGroup>
        <Label for="examplePassword">Password</Label>
        <Input
          id="examplePassword"
          name="password"
          placeholder="Enter your password"
          type="password"
          onChange={handleChange}
          value={form.password}
          invalid={errors.password} // Hata varsa Input invalid olacak
        />
        {errors.password && (
          <FormFeedback>{errorMessages.password}</FormFeedback>
        )}
        {/* Password hatası */}
      </FormGroup>

      {/* terms tiklenme ksımı: */}
      <FormGroup check>
        <Input
          id="terms"
          name="terms"
          checked={form.terms}
          type="checkbox"
          onChange={handleChange}
          invalid={errors.terms} //hata varsa input invalid olacak..
        />
        <Label htmlFor="terms" check>
          I agree to terms of service and privacy policy
        </Label>
        {errors.terms && <FormFeedback>{errorMessages.terms}</FormFeedback>}
      </FormGroup>

      <FormGroup className="text-center p-4">
        <Button type="submit" disabled={!isValid} color="primary">
          Sign In
        </Button>
      </FormGroup>
    </Form>
  );
}
