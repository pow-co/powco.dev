'use strict';
const {
  Model
} = require('sequelize');

const { publish } = require('rabbi')

module.exports = (sequelize, DataTypes) => {
  class GithubIssue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      models.BoostPowProof.hasOne(models.GithubIssue, {
        as: 'issue',
        foreignKey: 'txid',
        sourceKey: 'content'
      })

      models.GithubIssue.hasMany(models.BoostPowProof, {
        as: 'boostpow_proofs',
        foreignKey: 'content',
        sourceKey: 'txid'
      })
    }
  }
  GithubIssue.init({
    issue_id: DataTypes.NUMBER,
    data: DataTypes.JSON,
    repo: DataTypes.STRING,
    org: DataTypes.STRING,
    txid: DataTypes.STRING,
    state: DataTypes.STRING,
    run_origin: DataTypes.STRING,
    run_location: DataTypes.STRING,
    run_owner: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'GithubIssue',
    hooks: {
      afterCreate: async (record, options) => {

        publish('powco.dev', 'github.issue.created', record.toJSON())

      }
    }
  });
  return GithubIssue;
};
