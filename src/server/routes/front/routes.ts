import express, { Router, Request, Response } from "express";
import {createClient} from "redis";

const router: Router = express.Router();

router.get("/logged/:email", async (req: Request, res: Response) => {
  var value;
  if(req.params.email != undefined)
  {
    const client = createClient();
    await client.connect();
    const response = await client.get(req.params.email);
    value = JSON.parse(response);
    if(!value)
    {
      value = {status: "empty"};
    }
  }
  else
  {
    value = {status: "empty"};
  }
  res.header("Content-Type", "application/json");
  res.header("X-version","2");
  res.header("X-sender","redis");
  res.header("X-destination","enrouting");
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
  await client.expire(req.body.email, 60*60);//El tiempo de expiración va en segundos
  res.header("Content-Type", "application/json");
  res.header("X-version","2");
  res.header("X-sender","redis");
  res.header("X-destination","enrouting");
  res.status(200).send({status: true});
});

router.delete("/logout/:email", async (req: Request, res: Response) => {
  const client = createClient();
  await client.connect();
  await client.expire(req.params.email, 1);//El tiempo de expiración va en segundos
  res.header("Content-Type", "application/json");
  res.header("X-version","2");
  res.header("X-sender","redis");
  res.header("X-destination","enrouting");
  res.status(200).send({status: true});
});


export default router;
