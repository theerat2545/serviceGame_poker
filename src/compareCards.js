// compareCards.js
export function compareCards(data) {
    if (!Array.isArray(data) || data.length !== 2) {
        console.error('Invalid data format:', data);
        return { error: 'Invalid data format' };
    }

    const [redCard, blueCard] = data;

    if (typeof redCard.rank === 'undefined' || typeof blueCard.rank === 'undefined') {
        console.error('Rank is undefined for one of the cards:', { redCard, blueCard });
        return { error: 'Rank information is missing' };
    }

    let result = {
        RED: redCard.rank,
        BLUE: blueCard.rank,
        WIN: ''
    };

    if (redCard.rank > blueCard.rank) {
        result.WIN = 'RED';
    } else if (blueCard.rank > redCard.rank) {
        result.WIN = 'BLUE';
    } else if (blueCard.rank === redCard.rank) {
        if (blueCard.id < redCard.id) {
            result.WIN = 'BLUE';
        } else if (redCard.id < blueCard.id) {
            result.WIN = 'RED';
        } else if (blueCard.id === redCard.id) {
            result.WIN = 'TIE';
        }
    }

    return result;
}
