'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('GithubIssues', 'txhex', { type: Sequelize.TEXT });
    await queryInterface.addColumn('GithubIssues', 'json', { type: Sequelize.JSON });
    await queryInterface.addColumn('GithubIssues', 'version', { type: Sequelize.STRING });
    await queryInterface.addColumn('GithubIssues', 'platform', { type: Sequelize.STRING });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('GithubIssues', 'txhex');
    await queryInterface.removeColumn('GithubIssues', 'json');
    await queryInterface.removeColumn('GithubIssues', 'version');
    await queryInterface.removeColumn('GithubIssues', 'platform');
  }
};
