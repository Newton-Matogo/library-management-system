import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Create the genres
  const fiction = await prisma.genre.upsert({
    where: { name: 'Fiction' },
    update: {},
    create: {
      name: 'Fiction',
      description: 'Imaginative stories and novels',
    },
  });

  const science = await prisma.genre.upsert({
    where: { name: 'Science' },
    update: {},
    create: {
      name: 'Science',
      description: 'Scientific discoveries and knowledge',
    },
  });

  const history = await prisma.genre.upsert({
    where: { name: 'History' },
    update: {},
    create: {
      name: 'History',
      description: 'Historical events and biographies',
    },
  });

  const technology = await prisma.genre.upsert({
    where: { name: 'Technology' },
    update: {},
    create: {
      name: 'Technology',
      description: 'Computers, innovation, and technology',
    },
  });

  // Create the books
  const books = [
    {
      title: 'Things Fall Apart',
      author: 'Chinua Achebe',
      genreId: fiction.id,
    },
    {
      title: 'The River Between',
      author: 'Ngugi wa Thiong’o',
      genreId: fiction.id,
    },
    {
      title: 'Purple Hibiscus',
      author: 'Chimamanda Ngozi Adichie',
      genreId: fiction.id,
    },
    {
      title: 'Half of a Yellow Sun',
      author: 'Chimamanda Ngozi Adichie',
      genreId: fiction.id,
    },

    {
      title: 'A Brief History of Time',
      author: 'Stephen Hawking',
      genreId: science.id,
    },
    {
      title: 'The Selfish Gene',
      author: 'Richard Dawkins',
      genreId: science.id,
    },
    { title: 'Cosmos', author: 'Carl Sagan', genreId: science.id },
    {
      title: 'The Origin of Species',
      author: 'Charles Darwin',
      genreId: science.id,
    },

    {
      title: 'The Diary of a Young Girl',
      author: 'Anne Frank',
      genreId: history.id,
    },
    {
      title: 'Long Walk to Freedom',
      author: 'Nelson Mandela',
      genreId: history.id,
    },
    {
      title: 'The Wretched of the Earth',
      author: 'Frantz Fanon',
      genreId: history.id,
    },
    { title: 'Sapiens', author: 'Yuval Noah Harari', genreId: history.id },

    { title: 'Clean Code', author: 'Robert C. Martin', genreId: technology.id },
    {
      title: 'The Pragmatic Programmer',
      author: 'Andrew Hunt and David Thomas',
      genreId: technology.id,
    },
    {
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen et al.',
      genreId: technology.id,
    },
    {
      title: 'The Innovators',
      author: 'Walter Isaacson',
      genreId: technology.id,
    },
  ];

  // Insert books without creating duplicates
  for (const book of books) {
    await prisma.book.upsert({
      where: { title: book.title },
      update: {},
      create: book,
    });
  }

  console.log('Database seeded successfully!');
  console.log('Created or confirmed 4 genres and 16 books.');
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
