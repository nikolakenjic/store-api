const Product = require('../models/product');

const getAllProductsStatic = async (req, res, next) => {
  // throw new Error('Testing async errors');
  const products = await Product.find({ company: 'ikea' });
  res.status(200).json({ products });
};

const getAllProducts = async (req, res, next) => {
  const { featured, company, name, sort, fields } = req.query;

  const queryObject = {};
  // If is query undifined we add new queryObject to return all value
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }

  if (company) {
    queryObject.company = company;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: 'i' };
  }

  let result = Product.find(queryObject);

  if (sort) {
    const sorttList = sort.split(',').join(' ');
    result = result.sort(sorttList);
  } else {
    result = result.sort('createdAt');
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }

  // Pagination and limit per page
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
