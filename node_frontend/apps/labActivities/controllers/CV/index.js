'user strict';

const CVController = {
  Show: (req, res, next) => {
    res.send(req.params.id);
  }
};

module.exports = CVController;
