const { createServer } = require('http');

let db = [
  {
    id: 1,
    title: 'Why Did the Chicken Cross the Road?',
    comedian: 'Eddie Izzard',
    year: 1999,
  },
  {
    id: 2,
    title: 'The Hilarious Doctor Visit',
    comedian: 'Jerry Seinfeld',
    year: 1995,
  },
  {
    id: 3,
    title: 'Golfing Fiasco: A Story of Mishaps',
    comedian: 'Tig Notaro',
    year: 2015,
  },
  {
    id: 4,
    title: 'Dad Jokes: Embarrassing Yet Funny',
    comedian: 'Jim Gaffigan',
    year: 2010,
  },
  {
    id: 5,
    title: 'The Bear in the Bar',
    comedian: 'John Mulaney',
    year: 2018,
  },
  {
    id: 6,
    title: 'Fish Out of Water',
    comedian: 'Ellen DeGeneres',
    year: 2003,
  },
  {
    id: 7,
    title: 'Elephants Never Forget... to Be Funny',
    comedian: 'Louis C.K.',
    year: 2008,
  },
  {
    id: 8,
    title: 'Banana: The Ultimate Comedy Fruit',
    comedian: 'Gabriel Iglesias',
    year: 2012,
  },
  {
    id: 9,
    title: 'The Pizza Delivery Nightmare',
    comedian: 'Amy Schumer',
    year: 2016,
  },
  {
    id: 10,
    title: 'Cats vs. Dogs: The Epic Showdown',
    comedian: 'Kevin Hart',
    year: 2007,
  },
];

// const requestHandler = (req, res) => {
//   console.log(req.url);

//   if (req.url === '/' && req.method === 'GET') {
//     res.end(JSON.stringify({ message: 'APi Working' }));
//   } else if (req.url === '/jokes' && req.method === 'GET') {
//     res.end(JSON.stringify([]));
//   } else if (req.url === '/jokes' && req.method === 'PUT') {
//     res.end(JSON.stringify([]));
//   } else {
//     res.end(JSON.stringify({ message: 'putting found' }));
//   }
// };
const requestHandler = (req, res) => {
  console.log(req.url);
  if (req.url === '/' && req.method === 'GET') {
    funnyJokes(req, res);
  } else if (req.url === '/jokes' && req.method === 'POST') {
    postJokes(req, res);
  } else if (req.url === '/jokes/1' && req.method === 'PATCH') {
    updateJoke(req, res);
  } else if (req.url === '/jokes/1' && req.method === 'DELETE') {
    deleteJoke(req, res);
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: true, message: 'Not found' }));
  }
};

function funnyJokes(req, res) {
  res.writeHead(200);
  res.end(JSON.stringify({ data: db, message: 'Data Fetched Succesful' }));
}

function postJokes(req, res) {
  let body = [];

  req.on('data', chunk => {
    body.push(chunk);
  });

  req.on('end', () => {
    body = Buffer.concat(body).toString();
    const newJoke = JSON.parse(body);
    // Add the new joke to your database (db)
    db.push(newJoke);
    res.writeHead(201);
    res.end(JSON.stringify({ data: db, message: 'Joke posted successfully' }));
  });
}

function updateJoke(req, res) {
  console.log(req.body);

  const body = [];

  const id = +req.url.split('/')[2];

  req.on('data', chunk => {
    body.push(chunk);
  });

  req.on('end', () => {
    const convertedBuffer = Buffer.concat(body).toString();

    const jsonResponse = JSON.parse(convertedBuffer);

    const updateDb = db.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...jsonResponse,
        };
      }

      return item;
    });

    db = updateDb;
  });

  res.end(JSON.stringify(db));
}

function deleteJoke(req, res) {
  console.log(req.body);

  const id = req.url.split('/')[2];

  const index = db.findIndex(joke => joke.id === parseInt(id))
  if(index !== -1) {
    const deletedJoke = db.splice(index, 1)[0];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ deletedJoke, message: 'Joke deleted successfully' })); 
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: true, message: 'Joke not found' }));
  }
}


const server = createServer(requestHandler)
server.listen(3000, () => {
  console.log('Server running');
});
