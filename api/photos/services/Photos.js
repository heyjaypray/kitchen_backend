'use strict';

/**
 * Photos.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require('lodash');

module.exports = {

  /**
   * Promise to fetch all photos.
   *
   * @return {Promise}
   */

  fetchAll: (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('photos', params);
    // Select field to populate.
    const populate = Photos.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    return Photos
      .find()
      .where(filters.where)
      .sort(filters.sort)
      .skip(filters.start)
      .limit(filters.limit)
      .populate(populate);
  },

  /**
   * Promise to fetch a/an photos.
   *
   * @return {Promise}
   */

  fetch: (params) => {
    // Select field to populate.
    const populate = Photos.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    return Photos
      .findOne(_.pick(params, _.keys(Photos.schema.paths)))
      .populate(populate);
  },

  /**
   * Promise to count photos.
   *
   * @return {Promise}
   */

  count: (params) => {
    // Convert `params` object to filters compatible with Mongo.
    const filters = strapi.utils.models.convertParams('photos', params);

    return Photos
      .count()
      .where(filters.where);
  },

  /**
   * Promise to add a/an photos.
   *
   * @return {Promise}
   */

  add: async (values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Photos.associations.map(ast => ast.alias));
    const data = _.omit(values, Photos.associations.map(ast => ast.alias));

    // Create entry with no-relational data.
    const entry = await Photos.create(data);

    // Create relational data and return the entry.
    return Photos.updateRelations({ id: entry.id, values: relations });
  },

  /**
   * Promise to edit a/an photos.
   *
   * @return {Promise}
   */

  edit: async (params, values) => {
    // Extract values related to relational data.
    const relations = _.pick(values, Photos.associations.map(a => a.alias));
    const data = _.omit(values, Photos.associations.map(a => a.alias));

    // Update entry with no-relational data.
    const entry = await Photos.update(params, data, { multi: true });

    // Update relational data and return the entry.
    return Photos.updateRelations(Object.assign(params, { values: relations }));
  },

  /**
   * Promise to remove a/an photos.
   *
   * @return {Promise}
   */

  remove: async params => {
    // Select field to populate.
    const populate = Photos.associations
      .filter(ast => ast.autoPopulate !== false)
      .map(ast => ast.alias)
      .join(' ');

    // Note: To get the full response of Mongo, use the `remove()` method
    // or add spent the parameter `{ passRawResult: true }` as second argument.
    const data = await Photos
      .findOneAndRemove(params, {})
      .populate(populate);

    if (!data) {
      return data;
    }

    await Promise.all(
      Photos.associations.map(async association => {
        const search = _.endsWith(association.nature, 'One') || association.nature === 'oneToMany' ? { [association.via]: data._id } : { [association.via]: { $in: [data._id] } };
        const update = _.endsWith(association.nature, 'One') || association.nature === 'oneToMany' ? { [association.via]: null } : { $pull: { [association.via]: data._id } };

        // Retrieve model.
        const model = association.plugin ?
          strapi.plugins[association.plugin].models[association.model || association.collection] :
          strapi.models[association.model || association.collection];

        return model.update(search, update, { multi: true });
      })
    );

    return data;
  }
};
