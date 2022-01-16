import app from "./server/server";

app.listen(process.env.PORT, () => {
  return console.log(
    `${new Date()} server is listening on ${process.env.PORT}`
  );
});
