const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

// ข้อมูลของไพ่
const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades'];
const ranks = [
  { rank: 1, name: 'A' },
  { rank: 2, name: '2' },
  { rank: 3, name: '3' },
  { rank: 4, name: '4' },
  { rank: 5, name: '5' },
  { rank: 6, name: '6' },
  { rank: 7, name: '7' },
  { rank: 8, name: '8' },
  { rank: 9, name: '9' },
  { rank: 10, name: '10' },
  { rank: 11, name: 'J' },
  { rank: 12, name: 'Q' },
  { rank: 13, name: 'K' }
];
const colors = { 'Clubs': 'Black', 'Spades': 'Black', 'Diamonds': 'Red', 'Hearts': 'Red' };

// สร้างไพ่ทั้งหมด
const deck = [];
let id = 1;
suits.forEach(suit => {
  ranks.forEach(rank => {
    deck.push({
      id: id++,                          // id เป็นตัวเลขตั้งแต่ 1 ถึง 52
      rank: rank.rank,                   // แต้มบนไพ่ เช่น 1 (A), 2, 3, ..., 13 (K)
      suit: `${colors[suit]} ${suit}`,   // สีและดอกของไพ่ เช่น "Black Clubs", "Red Diamonds"
    });
  });
});

app.post('/api/draw', (req, res) => {
  function drawCard(deck, drawnIndices) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * deck.length);
    } while (drawnIndices.includes(randomIndex));
    drawnIndices.push(randomIndex);
    return deck[randomIndex];
  }

  const drawnIndices = [];
  const drawnCards = [];

  drawnCards.push(drawCard(deck, drawnIndices));
  drawnCards.push(drawCard(deck, drawnIndices));

  res.json(drawnCards);
});

// // Route: แสดงไพ่ทั้งหมด
// app.get('/api/cards', (req, res) => {
//   res.json(deck);
// });

// // Route: แสดงไพ่ตาม id
// app.get('/api/cards/:id', (req, res) => {
//   const cardId = parseInt(req.params.id);
//   const card = deck.find(c => c.id === cardId);
//   if (card) {
//     res.json(card);
//   } else {
//     res.status(404).send('Card not found');
//   }
// });



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});