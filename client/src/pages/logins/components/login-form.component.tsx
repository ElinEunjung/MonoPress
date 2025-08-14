import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";

import { useApi } from "@/hooks/use-api";
import StackLayout from "@/components/compositions/stack-layouts/stack-layout.component";
import SwitcherLayout from "@/components/compositions/switcher-layouts/switcher-layout.component";
import InputField from "@/components/forms/input-field.component";

const INITIAL_LOGIN_VALUES = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const [errorFormMessage, setErrorFormMessage] =
    useState(INITIAL_LOGIN_VALUES);

  const [login, setLogin] = useState(INITIAL_LOGIN_VALUES);

  const navigate = useNavigate();
  const api = useApi("/login/mongo", {
    method: "post",
  });

  useEffect(() => {
    if (api.isSuccess) {
      localStorage.setItem("mock-user", JSON.stringify(api.data));
      navigate("/dashboard");
    }
  }, [api.isSuccess]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = {
      email: !login.email ? "Epost er påkrevd" : "",
      password: !login.password ? "Passord er påkrevd" : "",
    };

    setErrorFormMessage(validationErrors);

    const isFormValid = !Object.values(validationErrors).some((error) => error);

    if (isFormValid) {
      api.mutate(login);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <StackLayout gap="0.5em">
        <InputField
          label="Email"
          type="email"
          placeholder="Email"
          required
          errorMessage={errorFormMessage.email}
          value={login.email}
          onChange={(event) =>
            setLogin({ ...login, email: event.target.value })
          }
        />

        <InputField
          label="Password"
          type="password"
          placeholder="Passord"
          required
          errorMessage={errorFormMessage.password}
          value={login.password}
          onChange={(event) =>
            setLogin({ ...login, password: event.target.value })
          }
        />

        <SwitcherLayout limit="2" threshold="90em">
          <button type="submit">Login</button>
          <button type="reset">Reset</button>
        </SwitcherLayout>
      </StackLayout>
    </form>
  );
};

export default LoginForm;
