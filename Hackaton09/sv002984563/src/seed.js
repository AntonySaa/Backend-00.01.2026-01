const { sequelize, User, Course } = require(`./models`);

async function seed() { 
    await sequelize.sync({ force: true });
    console.log("db sincronizada");
    
await User.bulkCreate([
  { firstName:'Ada', lastName:'Lovelace', email:'ada@dev.io', passwordHash:'1234567890', role:'instructor' },
  { firstName:'Luis', lastName:'Lopez', email:'luislopez1@dev.io', passwordHash:'1234567890', role:'student' },
  { firstName:'jos', lastName:'Perez', email:'luislopez2@dev.io', passwordHash:'1234567890', role:'student' },
  { firstName:'Mari', lastName:'Lopez', email:'luislopez3@dev.io', passwordHash:'1234567890', role:'student' },
  { firstName:'Jose', lastName:'Lopez', email:'luislopez4@dev.io', passwordHash:'1234567890', role:'student' },
  { firstName:'Juan', lastName:'Lovelace', email:'luislopez5@dev.io', passwordHash:'1234567890', role:'student' },
  { firstName:'Raul', lastName:'Lopez', email:'luislopez6@dev.io', passwordHash:'1234567890', role:'student' },
  { firstName:'Rosa', lastName:'Lopez', email:'luislopez7@dev.io', passwordHash:'1234567890', role:'student' },
  { firstName:'Clau', lastName:'Perez', email:'luislope8@dev.io', passwordHash:'1234567890', role:'student' },
  { firstName:'Caty', lastName:'Perez', email:'luislope9@dev.io', passwordHash:'1234567890', role:'student' },
  { firstName:'Val', lastName:'Lovelace', email:'ada2@dev.io', passwordHash:'1234567890x', role:'instructor' },
  { firstName:'Sam', lastName:'Lovelace', email:'ada3@dev.io', passwordHash:'1234567890x', role:'instructor' },
  { firstName:'Linus', lastName:'Torvalds', email:'linus@dev.io', passwordHash:'1234567890', role:'student' }
], { ignoreDuplicates: true });

const [course] = await Course.findOrCreate({
  where: { slug:'intro-node' },
  defaults: { title:'Intro a Node', description:'Curso base', published:true, ownerId: 1 }
});

}

