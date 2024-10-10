const { PickUtility } = require("../utils/index");

class Service {
  constructor(model) {
    this.model = model;
  }

  /**
   * Create a new document
   * @param {object} body - To be created document body
   * @returns {Promise<object>} Created document
   */
  async create(body) {
    const Model = this.model;
    const document = await new Model(body).save();
    return document;
  }

  /**
   * Get a document by id
   * @param {object} filter - Mongo filter body
   * @param {object} options - Query options
   * @param {object} [options.populate] - Mongoose population object
   * @param {string} [options.select] - Mongoose projection string
   * @returns {Promise<object>} Found document
   */
  async get(filter, options = {}) {
    const Model = this.model;
    const document = await Model.findOne(filter)
      .populate(options.populate)
      .select(options.select)
      .lean({ virtuals: true });
    return document;
  }

  /**
   * Aggregate query documents
   * @param {object} options - Query options
   * @param {object} [options.match] - Mongo match body
   * @param {object} [options.lookup] - Mongo lookup body
   * @param {object} [options.facet] - Mongo facet body
   * @param {object} [options.addFields] - Mongo addFields body
   * @param {object} [options.project] - Mongo projection body
   * @param {object} [options.sort] - Mongo sort body
   * @param {object} [options.skip] - Mongo skip body
   * @param {object} [options.limit] - Mongo limit body
   * @param {object} [options.count] - Mongo count body
   * @returns {Promise<{ totalPages: number, currentPage: number, total: number, data: [object] }>} Total pages number, current page, total number documents and data of founded objects
   */
  async aggregateQuery(options = {}) {
    const Model = this.model;
    let lookupStages = [];

    // Check if options.lookup is an object or an array
    if (options.lookup) {
      if (Array.isArray(options.lookup)) {
        lookupStages = options.lookup;
      } else if (typeof options.lookup === "object") {
        lookupStages = [options.lookup];
      } else {
        throw new Error(
          "Invalid type for options.lookup. Expected an object or array."
        );
      }
    }

    // Construct aggregation stages with normalized lookup
    const aggregationStages = [
      ...lookupStages,
      ...Object.values(
        PickUtility(options, [
          "unwind",
          "match",
          "addFields",
          "facet",
          "sort",
          "skip",
          "limit",
          "project",
          "group",
        ])
      ),
    ];
    const documents = await Model.aggregate(aggregationStages);
    if (options.limit || options.skip) {
      const countAggregationStages = [
        ...lookupStages,
        ...Object.values(PickUtility(options, ["unwind", "match"])),
      ];
      const count = await Model.aggregate(countAggregationStages);
      return {
        totalPages: Math.ceil(count.length / options.size),
        currentPage: Number(options.page),
        total: count.length,
        data: documents,
      };
    }
    return documents;
  }

  /**
   * Update a document by filter body
   * @param {object} filter - Mongo filter body
   * @param {object} updateBody - Mongo update body
   * @returns {Promise<object>} Updated document
   */
  async update(filter, updateBody = {}, options = {}) {
    const Model = this.model;
    const document = await Model.findOneAndUpdate(
      filter,
      updateBody,
      options
    ).lean({
      virtuals: true,
    });
    return document;
  }
}

module.exports = Service;
