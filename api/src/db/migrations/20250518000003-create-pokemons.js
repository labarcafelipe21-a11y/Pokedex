'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pokemons', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      numero_pokedex: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      tipo_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'tipos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      tipo2_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'tipos', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      nivel: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      ps: {
        type: Sequelize.INTEGER,
        defaultValue: 45,
      },
      ataque: {
        type: Sequelize.INTEGER,
        defaultValue: 45,
      },
      defensa: {
        type: Sequelize.INTEGER,
        defaultValue: 45,
      },
      velocidad: {
        type: Sequelize.INTEGER,
        defaultValue: 45,
      },
      imagen_url: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      es_shiny: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      capturado_en: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('pokemons', ['user_id']);
    await queryInterface.addIndex('pokemons', ['tipo_id']);
    await queryInterface.addIndex('pokemons', ['nombre']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('pokemons');
  },
};