// A database rule was broken -> what the client should hear.
// The key is the constraint name from YOUR migration. PostgreSQL names a
// foreign key "<table>_<column>_fkey" when the migration does not name it.
// Write one entry for each constraint a client can hit. Example:
//
//   uq_player_nickname: {
//     status: 409,
//     code: 'NICKNAME_TAKEN',
//     message: 'That nickname is already used in this game.',
//   },
//
// A constraint that is not listed here still answers 409, with the code CONFLICT.
module.exports = {
  players_session_nickname_unique: {
    status: 409,
    code: 'NICKNAME_TAKEN',
    message: 'That nickname is already used in this game.',
  },
  game_sessions_set_id_fkey: {
    status: 409,
    code: 'QUESTION_SET_IN_USE',
    message: 'This question set was used in a game and cannot be deleted.',
  },
  question_sets_name_key: {
    status: 409,
    code: 'QUESTION_SET_NAME_TAKEN',
    message: 'A question set with that name already exists.',
  },
};
