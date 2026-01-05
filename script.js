document.addEventListener('DOMContentLoaded', () => {
    const genreLinks = document.querySelectorAll('.genre');
    const movieCards = document.querySelectorAll('.movie-card');
    const bookButtons = document.querySelectorAll('.book-button');

    genreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior
            const selectedGenre = link.getAttribute('data-genre');

            // Show or hide movie cards based on selected genre
            movieCards.forEach(card => {
                if (selectedGenre === 'all' || card.getAttribute('data-genre') === selectedGenre) {
                    card.classList.remove('hidden'); // Show card
                } else {
                    card.classList.add('hidden'); // Hide card
                }
            });
        });
    });

    // Handle book button clicks
    bookButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default button behavior
            const movieTitle = button.getAttribute('data-movie');
            alert(`Booking for ${movieTitle} is successful!`); // Show a confirmation message
        });
    });
});