// This acts as a proxy for fauna
export default async (req, res) => {
  if (req.method === "POST") {
    const response = await fetch("https://graphql.fauna.com/graphql", {
      method: "POST",
      body: req.body,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FAUNA_SERVER_KEY}`,
      },
    });

    const result = await response.json();

    res.send(result);
  } else {
    res.status(204).send();
  }
};
