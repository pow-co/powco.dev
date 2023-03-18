'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn('GithubIssues', 'title', { type: Sequelize.TEXT });
     await queryInterface.addColumn('GithubIssues', 'description', { type: Sequelize.TEXT });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.remoteColumn('GithubIssues', 'title')
    await queryInterface.remoteColumn('GithubIssues', 'description')
  }
};
