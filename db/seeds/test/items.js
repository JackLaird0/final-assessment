exports.seed = function(knex, Promise) {
  return knex('items').del()
    .then(function () {
      return Promise.all([
        knex('items').insert({name: 'item 1', status: false})
      ])
      .then(() => console.log('Seeding Complete!'))
    })
    .catch(error => console.log(`Error seedong data: ${error}`))
};
