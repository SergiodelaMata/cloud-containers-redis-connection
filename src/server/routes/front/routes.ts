import express, { Router, Request, Response } from "express";
import {createClient} from "redis";

const router: Router = express.Router();

router.get("/logged/:email", async (req: Request, res: Response) => {
  const client = createClient();
  await client.connect();
  const response = await client.get(req.params.email);
  var value = JSON.parse(response);
  if(!value)
  {
    value = {status: "empty"};
  }
  res.status(200).send(value);
});

router.post("/login", async (req: Request, res: Response) => {
  const client = createClient();
  await client.connect();
  const value = {
    userId : req.body.userId,
    rol : req.body.rol
  };
  await client.set(req.body.email, JSON.stringify(value));
  await client.expire(req.body.rol, 60*60);//El tiempo de expiración va en segundos
  res.status(200).send([{status: true}]);
});

export default router;
