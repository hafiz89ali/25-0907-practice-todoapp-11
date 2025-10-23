async function getHealth(req, res) {
  const data = {
    message: "Practice #11 Ok!",
  };
  console.log("Running getHealth.");
  return res.status(200).json(data);
}

async function postHealth(req, res) {
  const body = req.body;
  const data = {
    message: "Practice #11 Ok!",
    data: body,
  };
  console.log("Running postHealth.")
  return res.status(200).json(data);
}

const healthController = {
  getHealth,
  postHealth,
};

export default healthController;
