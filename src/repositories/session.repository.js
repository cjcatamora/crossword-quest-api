const { sequelize, GameSession, CrosswordGrid } = require('../models');

function findByCode(code) {
  return GameSession.findOne({ where: { join_code: code } });
}

// A game needs its own crossword grid. Both rows are saved together or not at all.
function createWithGrid(data) {
  return sequelize.transaction(async (transaction) => {
    const grid = await CrosswordGrid.create({}, { transaction });
    return GameSession.create({ ...data, grid_id: grid.grid_id }, { transaction });
  });
}

function update(session, changes) {
  return session.update(changes);
}

module.exports = { findByCode, createWithGrid, update };
