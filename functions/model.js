const mongoose = require('mongoose');

/**
 * @typedef {Object} GuildObject
 * @property {string} id - The guild id.
 * @property {string} dj - ID of the DJ Role.
 * @property {string} prefix - The prefix of the guild.
 * @property {number} volume - The volume of the guild.
 */

/**
 * @typedef {import('mongoose').Schema<GuildObject>} GuildSchema
 */

/**
 * @typedef {GuildObject & import('mongoose').Document} GuildDocument
 */

/**
 * @type GuildDocument
 */
const Schema = new mongoose.Schema({
	id: String,
	dj: String,
	prefix: String,
	volume: Number
});

/**
 * @type import('mongoose').Model<GuildDocument>
 */
const model = mongoose.model('tutomusic', Schema);

module.exports = model;
