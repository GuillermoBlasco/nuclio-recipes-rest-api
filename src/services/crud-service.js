const Joi = require("joi")
const PhotoService = require("../services/photo-service")
const mongoose = require('../models/mongoose');

function createCrudService ({ Collection, schema, beforeSave }) {
  function validate(document) {
    return schema.validate(document);
  }

  async function create(document) {
    if (beforeSave) {
      document = await beforeSave(document);
    }
    return (new mongoose[Collection](document)).save();
  }

  async function update(id, fields) {
    const document = await mongoose[Collection].findById(id).exec();
    let newDocument = {
      ...document.toObject(),
      ...fields,
    }
    if (beforeSave) {
      newDocument = await beforeSave(newDocument);
    }
    document.set(newDocument);
    await document.save();
    return document;
  }

  async function remove(id) {
    const response = await mongoose[Collection].findByIdAndDelete(id).exec();
    return response !== null;
  }

  function search(searchInput) {
    const { page, pageSize, ...query } = searchInput;
    /*
      query fields that do not exist in the collection return empty results, instead of a 400 Bad Request
     */
    Object.keys(query)
      .forEach(key => {
        const value = query[key];
        if (value.includes(',')) {
          query[key] = { $in: value.split(',') };
        }
      });
    return mongoose[Collection].find(query).skip(page * pageSize).limit(pageSize);
  }

  function getById(id) {
    return mongoose[Collection].findById(id).exec();
  }
  return {
    search,
    getById,
    create,
    update,
    remove,
    validate,
  };
}
module.exports = createCrudService;
