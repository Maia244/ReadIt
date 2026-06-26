// Seed catalogue of books users can search for + add to their lists,
// plus a starter set of ranked books and a social feed so the app
// looks alive on first launch (mirroring Beli's populated demo state).

// Real cover art via Open Library (by ISBN). `?default=false` makes the host
// return 404 for a missing cover so the UI can fall back to a coloured spine.
const cover = (isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false`

export const CATALOG = [
  { id: 'b1', title: 'The Name of the Wind', author: 'Patrick Rothfuss', genre: 'Fantasy', age: 'Adult', cover: '#6a4c93', coverUrl: cover('9780756404741'), year: 2007 },
  { id: 'b2', title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Sci-Fi', age: 'Adult', cover: '#1d3557', coverUrl: cover('9780593135204'), year: 2021 },
  { id: 'b3', title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', genre: 'Literary', age: 'Adult', cover: '#e63946', coverUrl: cover('9781501161933'), year: 2017 },
  { id: 'b4', title: 'Gone Girl', author: 'Gillian Flynn', genre: 'Thriller', age: 'Adult', cover: '#2b2d42', coverUrl: cover('9780307588371'), year: 2012 },
  { id: 'b5', title: 'The Midnight Library', author: 'Matt Haig', genre: 'Literary', age: 'Adult', cover: '#264653', coverUrl: cover('9780525559474'), year: 2020 },
  { id: 'b6', title: 'Percy Jackson: The Lightning Thief', author: 'Rick Riordan', genre: 'Fantasy', age: 'Middle Grade', cover: '#2a9d8f', coverUrl: cover('9780786838653'), year: 2005 },
  { id: 'b7', title: 'The Hunger Games', author: 'Suzanne Collins', genre: 'Sci-Fi', age: 'Young Adult', cover: '#bc6c25', coverUrl: cover('9780439023481'), year: 2008 },
  { id: 'b8', title: 'Where the Crawdads Sing', author: 'Delia Owens', genre: 'Literary', age: 'Adult', cover: '#606c38', coverUrl: cover('9780735219090'), year: 2018 },
  { id: 'b9', title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Help', age: 'Adult', cover: '#e76f51', coverUrl: cover('9780735211292'), year: 2018 },
  { id: 'b10', title: 'Educated', author: 'Tara Westover', genre: 'Biography', age: 'Adult', cover: '#457b9d', coverUrl: cover('9780399590504'), year: 2018 },
  { id: 'b11', title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Thriller', age: 'Adult', cover: '#3d405b', coverUrl: cover('9781250301697'), year: 2019 },
  { id: 'b12', title: 'Circe', author: 'Madeline Miller', genre: 'Fantasy', age: 'Adult', cover: '#9c6644', coverUrl: cover('9780316556347'), year: 2018 },
  { id: 'b13', title: 'It Ends with Us', author: 'Colleen Hoover', genre: 'Romance', age: 'Adult', cover: '#d4a373', coverUrl: cover('9781501110368'), year: 2016 },
  { id: 'b14', title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi', age: 'Adult', cover: '#bb3e03', coverUrl: cover('9780441013593'), year: 1965 },
  { id: 'b15', title: 'The Book Thief', author: 'Markus Zusak', genre: 'Historical', age: 'Young Adult', cover: '#5f0f40', coverUrl: cover('9780375842207'), year: 2005 },
  { id: 'b16', title: 'Wonder', author: 'R.J. Palacio', genre: 'Literary', age: 'Middle Grade', cover: '#0077b6', coverUrl: cover('9780375869020'), year: 2012 },
  { id: 'b17', title: 'The Very Hungry Caterpillar', author: 'Eric Carle', genre: 'Literary', age: 'Children', cover: '#52b788', coverUrl: cover('9780399226908'), year: 1969 },
  { id: 'b18', title: 'A Court of Thorns and Roses', author: 'Sarah J. Maas', genre: 'Romance', age: 'Young Adult', cover: '#7209b7', coverUrl: cover('9781619634442'), year: 2015 },
  { id: 'b19', title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'Non-Fiction', age: 'Adult', cover: '#283618', coverUrl: cover('9780062316097'), year: 2011 },
  { id: 'b20', title: 'The Shining', author: 'Stephen King', genre: 'Horror', age: 'Adult', cover: '#3a0ca3', coverUrl: cover('9780307743657'), year: 1977 },
  { id: 'b21', title: 'Klara and the Sun', author: 'Kazuo Ishiguro', genre: 'Sci-Fi', age: 'Adult', cover: '#48cae4', coverUrl: cover('9780593318171'), year: 2021 },
  { id: 'b22', title: 'Matilda', author: 'Roald Dahl', genre: 'Fantasy', age: 'Children', cover: '#e85d04', coverUrl: cover('9780142410370'), year: 1988 },
  { id: 'b23', title: 'The Way of Kings', author: 'Brandon Sanderson', genre: 'Fantasy', age: 'Adult', cover: '#023e8a', coverUrl: cover('9780765326355'), year: 2010 },
  { id: 'b24', title: 'Verity', author: 'Colleen Hoover', genre: 'Thriller', age: 'Adult', cover: '#6d191b', coverUrl: cover('9781538724736'), year: 2018 },
]

// User's already-ranked "Read" list with Beli-style scores (0–10).
export const SEED_READ = [
  { id: 'b2', score: 9.6, sentiment: 'liked', note: 'Could not put it down. Science + heart.' },
  { id: 'b12', score: 9.1, sentiment: 'liked', note: 'Gorgeous prose, loved Circe.' },
  { id: 'b3', score: 8.7, sentiment: 'liked', note: 'Old Hollywood drama done right.' },
  { id: 'b9', score: 8.2, sentiment: 'liked', note: 'Actually changed my routine.' },
  { id: 'b5', score: 7.4, sentiment: 'fine', note: 'Lovely idea, slow middle.' },
  { id: 'b11', score: 6.8, sentiment: 'fine', note: 'Twist was great, rest was meh.' },
  { id: 'b13', score: 5.2, sentiment: 'fine', note: 'Not really my thing.' },
]

export const SEED_WANT = ['b1', 'b14', 'b19', 'b23', 'b21']

export const SEED_RECS = ['b8', 'b10', 'b15']

// People you can search for and follow, à la Beli's "Members" search.
export const PEOPLE = [
  { id: 'u_maya', name: 'Maya', handle: 'mayareads', avatar: '#ff7b00', bio: 'Sci-fi & fantasy', followers: 1240, ranked: 312, favs: ['b14', 'b2', 'b23'] },
  { id: 'u_jordan', name: 'Jordan', handle: 'jordanlovesya', avatar: '#2a9d8f', bio: 'YA romance forever', followers: 880, ranked: 204, favs: ['b18', 'b7', 'b13'] },
  { id: 'u_sam', name: 'Sam', handle: 'samspages', avatar: '#9c6644', bio: 'Epic fantasy nerd', followers: 642, ranked: 158, favs: ['b1', 'b23', 'b12'] },
  { id: 'u_priya', name: 'Priya', handle: 'priyareads', avatar: '#7209b7', bio: 'Literary fiction', followers: 2110, ranked: 421, favs: ['b8', 'b3', 'b5'] },
  { id: 'u_alex', name: 'Alex', handle: 'alexturnspages', avatar: '#1d3557', bio: 'Thriller junkie', followers: 530, ranked: 142, favs: ['b4', 'b11', 'b24'] },
  { id: 'u_nina', name: 'Nina', handle: 'ninanovels', avatar: '#e63946', bio: 'Romance + a little spice', followers: 1760, ranked: 388, favs: ['b13', 'b18', 'b3'] },
  { id: 'u_leo', name: 'Leo', handle: 'leoreadshistory', avatar: '#457b9d', bio: 'Non-fiction & history', followers: 410, ranked: 97, favs: ['b19', 'b10', 'b15'] },
  { id: 'u_zoe', name: 'Zoe', handle: 'zoezone', avatar: '#52b788', bio: 'Middle-grade magic', followers: 690, ranked: 176, favs: ['b6', 'b22', 'b16'] },
  { id: 'u_theo', name: 'Theo', handle: 'theonightowl', avatar: '#3a0ca3', bio: 'Horror after dark', followers: 305, ranked: 88, favs: ['b20', 'b24', 'b11'] },
  { id: 'u_iris', name: 'Iris', handle: 'irisink', avatar: '#bc6c25', bio: 'Poetry & classics', followers: 920, ranked: 233, favs: ['b12', 'b8', 'b5'] },
]

// You already follow the friends whose activity shows up in your feed.
export const SEED_FOLLOWING = ['u_maya', 'u_jordan', 'u_sam', 'u_priya']

// Notifications (activity about you) shown in the bell panel.
export const SEED_NOTIFS = [
  { id: 'n1', user: 'Maya', avatar: '#ff7b00', type: 'like', bookId: 'b2', text: 'liked your rating of', time: '2h' },
  { id: 'n2', user: 'Jordan', avatar: '#2a9d8f', type: 'follow', text: 'started following you', time: '5h' },
  { id: 'n3', user: 'Priya', avatar: '#7209b7', type: 'comment', bookId: 'b12', text: 'commented on your rating of', time: '1d' },
  { id: 'n4', user: 'Sam', avatar: '#9c6644', type: 'rec', bookId: 'b1', text: 'recommended you', time: '1d' },
  { id: 'n5', user: 'Nina', avatar: '#e63946', type: 'like', bookId: 'b3', text: 'liked your rating of', time: '2d' },
  { id: 'n6', user: 'Leo', avatar: '#457b9d', type: 'follow', text: 'started following you', time: '3d' },
]

// Social feed of friends' recent activity.
export const SEED_FEED = [
  { id: 'f1', user: 'Maya', avatar: '#ff7b00', action: 'ranked', bookId: 'b14', score: 9.2, time: '2h', comment: 'Finally finished Dune — worth every page.', likes: 12, comments: 3 },
  { id: 'f2', user: 'Jordan', avatar: '#2a9d8f', action: 'ranked', bookId: 'b18', score: 8.4, time: '5h', comment: 'ACOTAR fans were right.', likes: 8, comments: 1 },
  { id: 'f3', user: 'Sam', avatar: '#9c6644', action: 'want', bookId: 'b23', time: '1d', comment: 'Adding this to my list!', likes: 5, comments: 0 },
  { id: 'f4', user: 'Priya', avatar: '#7209b7', action: 'ranked', bookId: 'b8', score: 7.9, time: '1d', comment: 'Beautiful but sad.', likes: 15, comments: 4 },
  { id: 'f5', user: 'Maya', avatar: '#ff7b00', action: 'ranked', bookId: 'b20', score: 6.1, time: '2d', comment: 'Spookier than the movie.', likes: 6, comments: 2 },
]
