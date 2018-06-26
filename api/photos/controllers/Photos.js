'use strict';

/**
 * Photos.js controller
 *
 * @description: A set of functions called "actions" for managing `Photos`.
 */

module.exports = {

  /**
   * Retrieve photos records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    return strapi.services.photos.fetchAll(ctx.query);
  },

  /**
   * Retrieve a photos record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.photos.fetch(ctx.params);
  },

  /**
   * Count photos records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.photos.count(ctx.query);
  },

  /**
   * Create a/an photos record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.photos.add(ctx.request.body);
  },

  /**
   * Update a/an photos record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.photos.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an photos record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.photos.remove(ctx.params);
  }
};
