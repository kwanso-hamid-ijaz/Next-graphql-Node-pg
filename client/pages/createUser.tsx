import Head from "next/head";
import Image from "next/image";

import { gql } from "@apollo/client";
import client from "../client";
import formStyles from "../styles/Form.module.css";
import { useState } from "react";
import { Button } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";

interface IFormInput {
  name: string;
  email: string;
  password: string;
  role: number;
}

const schema = yup.object().shape({
  name: yup.string().required(),
  password: yup.string().required(),
});

export const CREATE_USER = gql`
  mutation createUser(
    $name: String!
    $email: String!
    $password: String!
    $role: String!
  ) {
    createUser(name: $name, email: $email, password: $password, role: $role)
  }
`;

export default function createUser() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("General");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    const { data } = await client.mutate({
      mutation: CREATE_USER,
      variables: {
        name: name,
        email: email,
        password: password,
        role: role,
      },
    });
    router.push("/");
  };

  return (
    <div>
      <style jsx>{`
        input[type="text"],
        select {
          width: 100%;
          padding: 12px 20px;
          margin: 8px 0;
          display: inline-block;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }
        input[type="password"],
        select {
          width: 100%;
          padding: 12px 20px;
          margin: 8px 0;
          display: inline-block;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-sizing: border-box;
        }

        input[type="submit"] {
          width: 100%;
          background-color: #4caf50;
          color: white;
          padding: 14px 20px;
          margin: 8px 0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        input[type="submit"]:hover {
          background-color: #45a049;
        }
        form {
          max-width: 500px;
          margin: 0 auto;
        }
        form {
          max-width: 500px;
          margin: 0 auto;
        }

        h1 {
          color: rgb(197, 31, 86);
          text-align: center;
          padding-bottom: 10px;
          border-bottom: 1px solid rgb(79, 98, 148);
        }

        .form {
          background: #0e101c;
          max-width: 400px;
          margin: 0 auto;
        }

        p {
          color: #bf1650;
        }

        p::before {
          display: inline;
          content: "⚠ ";
        }
        div {
          border-radius: 5px;
          background-color: #f2f2f2;
          padding: 20px;
        }
        .form-submit-button {
          size: 100%;
          width: 200px;
          margin: 2%;
          margin-left: 50%;
          background: #0066a2;
          color: white;
          border-style: outset;
          border-color: #0066a2;
          height: 50px;
          font: bold 15px arial, sans-serif;
          text-shadow: none;
        }
      `}</style>
      <h1>Sign UP</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("name")}
          type="text"
          required
          placeholder="Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />

        {/* <input
          {...register("role")}
          type="text"
          required
          placeholder="Role"
          onChange={(e) => {
            setRole(e.target.value);
          }}
        /> */}

        <select
          required
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
          }}
        >
          <option value={"General"}>General</option>
          <option value={"Software Engineer"}>Software Engineer</option>
          <option value={"Marketing Strategist"}>Marketing Strategist</option>
          <option value={"UX Designer"}>UX Designer</option>
          <option value={"Content Specialist"}>Content Specialist</option>
        </select>

        <input
          {...register("email")}
          type="text"
          required
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />

        <input
          {...register("password")}
          type="password"
          required
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />

        <input type="submit" />
      </form>
    </div>
  );
}
