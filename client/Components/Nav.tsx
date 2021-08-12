import React from "react";
import navStyles from "../styles/Nav.module.css";
import Link from "next/link";

const Nav = () => {
  return (
    <nav className={navStyles.nav}>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/createUser">Create User</Link>
        </li>
        <li>
          <Link href="/users">All Users</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
