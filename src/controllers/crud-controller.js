const { Router } = require("express")
const validate = require("../middlewares/validate")


const isInt = text => !isNaN(parseInt(text));

// factory
function createRouter(Service) {
  const router = Router()
  router.get("/", async (req, res) => {
    const page = parseInt(req.query.page || 0);
    const pageSize = parseInt(req.query.pageSize || 10);
    const serviceData = {...req.query};
    if (!isInt(page) || page < 0) {
      res.status(400).json({ "message": "page should be a non negative number" })
      return
    }
    serviceData.page = page;
    if (!isInt(pageSize) || pageSize < 0) {
      res.status(400).json({ "message": "page size should be a non negative number" })
      return
    }
    serviceData.pageSize = pageSize;
    const documents = await Service.search(serviceData)
    res.status(200).json(documents)
  })

  router.post("/", validate(Service.validate), async (req, res) => {
    const document = await Service.create(req.body)
    res.status(201).json(document)
  })

  router.get("/:id", async (req, res) => {
    const document = await Service.getById(req.params.id)
    res.status(200).json(document)
  })

  router.put("/:id", async (req, res) => {
    const document = await Service.update(req.params.id, req.body)
    res.status(201).json(document)
  })

  router.delete("/:id", async (req, res) => {
    const removed = await Service.remove(req.params.id)
    if (removed) {
      res.status(204).end()
    } else {
      res.status(404).end()
    }
  })
  return router;
}
module.exports = createRouter;
