const express = require("express");

const { sequelize, User } = require("./models");

const app = express();

app.use(express.json());

app.post(
  "/users",
  async (
    req: { body: { name: any; email: any; role: any } },
    res: {
      json: (arg0: any) => any;
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: any): any; new (): any };
      };
    }
  ) => {
    console.log(req.body);
    const { name, email, role } = req.body;

    try {
      const user = await User.create({ name, email, role });

      return res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

app.get(
  "/users",
  async (
    req: any,
    res: {
      json: (arg0: any) => any;
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: { error: string }): any; new (): any };
      };
    }
  ) => {
    try {
      const users = await User.findAll();

      return res.json(users);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
);

app.get(
  "/users/:uuid",
  async (
    req: { params: { uuid: any } },
    res: {
      json: (arg0: any) => any;
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: { error: string }): any; new (): any };
      };
    }
  ) => {
    const uuid = req.params.uuid;
    try {
      const user = await User.findOne({
        where: { uuid },
      });

      return res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
);

app.delete(
  "/users/:uuid",
  async (
    req: { params: { uuid: any } },
    res: {
      json: (arg0: { message: string }) => any;
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: { error: string }): any; new (): any };
      };
    }
  ) => {
    const uuid = req.params.uuid;
    try {
      const user = await User.findOne({ where: { uuid } });

      await user.destroy();

      return res.json({ message: "User deleted!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
);

app.put(
  "/users/:uuid",
  async (
    req: { params: { uuid: any }; body: { name: any; email: any; role: any } },
    res: {
      json: (arg0: any) => any;
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: { error: string }): any; new (): any };
      };
    }
  ) => {
    const uuid = req.params.uuid;
    const { name, email, role } = req.body;
    try {
      const user = await User.findOne({ where: { uuid } });

      user.name = name;
      user.email = email;
      user.role = role;

      await user.save();

      return res.json(user);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
);

app.listen({ port: 5000 }, async () => {
  console.log("server is running on http://localhost:5000");
  // await sequelize.sync();
  await sequelize.authenticate();
  console.log("database Conneted");
});
