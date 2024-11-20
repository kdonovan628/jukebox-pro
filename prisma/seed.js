const prisma = require(`./index`);
const { faker } =  require(`@faker-js/faker`);

const seed = async (numUsers = 5, numPlaylists = 10, numTracks = 20) => {
  const users = Array.from({ length: numUsers }, () => ({
    username: faker.internet.username(),
  }));

  await prisma.user.createMany({ data: users });

  const tracks = Array.from({ length: numTracks }, () => ({
    name: faker.music.songName(),
  }));

  await prisma.track.createMany({ data: tracks });

  for (let i = 0; i < numPlaylists; i++) {
    const trackCount = 1 + Math.floor(Math.random() * 5);
    const selectedTracks = Array.from({ length: trackCount }, () => ({
      id: 1 + Math.floor(Math.random() * numTracks),
    }));

    await prisma.playlist.create({
      data: {
        name: faker.music.genre(),
        description: faker.lorem.sentence(),
        owner: { connect: { id: 1 + Math.floor(Math.random() * numUsers) } },
        tracks: { connect: selectedTracks },
      },
    });
  }
};

seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });