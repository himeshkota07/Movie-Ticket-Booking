document.addEventListener('DOMContentLoaded', () => {
    const genreLinks = document.querySelectorAll('.genre');
    const movieCards = document.querySelectorAll('.movie-card');
    const bookButtons = document.querySelectorAll('.book-button');

    // Genre filtering
    genreLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedGenre = link.getAttribute('data-genre');

            movieCards.forEach(card => {
                if (selectedGenre === 'all' || card.getAttribute('data-genre') === selectedGenre) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // Seating variables
    const seatingModal = document.getElementById('seatingModal');
    const closeModal = document.querySelector('.close-modal');
    const seatingLayout = document.getElementById('seatingLayout');
    const selectedSeatsText = document.getElementById('selectedSeatsText');
    const totalPriceText = document.getElementById('totalPrice');
    const confirmBookingBtn = document.querySelector('.confirm-booking');
    const movieTitleText = document.getElementById('movieTitle');
    
    let selectedSeats = [];
    let currentMovie = ''; // Track current movie being booked
    const seatPrice = 150; // Price per seat in rupees
    const rows = 8;
    const seatsPerRow = 12;
    const preBookedSeats = new Set([
        'A2', 'A5', 'A10', 'B3', 'B8', 'C1', 'C6', 'C11', 'D4', 'D9',
        'E2', 'E7', 'F5', 'G3', 'G8', 'H6'
    ]); // Pre-booked seats
    const movieBookings = {}; // Store booked seats per movie

    // Function to get all booked seats for current movie
    function getBookedSeatsForMovie(movie) {
        const allBooked = new Set(preBookedSeats);
        if (movieBookings[movie]) {
            movieBookings[movie].forEach(seat => allBooked.add(seat));
        }
        return allBooked;
    }

    // Generate seating layout
    function generateSeats() {
        seatingLayout.innerHTML = '';
        selectedSeats = [];
        const bookedSeats = getBookedSeatsForMovie(currentMovie);
        
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.className = 'row';
            const rowLabel = String.fromCharCode(65 + i); // A, B, C, etc.
            
            for (let j = 1; j <= seatsPerRow; j++) {
                const seat = document.createElement('div');
                const seatId = `${rowLabel}${j}`;
                
                seat.className = 'seat available';
                seat.textContent = j;
                seat.dataset.seatId = seatId;
                
                if (bookedSeats.has(seatId)) {
                    seat.classList.remove('available');
                    seat.classList.add('booked');
                } else {
                    seat.addEventListener('click', toggleSeat);
                }
                
                row.appendChild(seat);
            }
            seatingLayout.appendChild(row);
        }
    }

    // Toggle seat selection
    function toggleSeat(e) {
        const seat = e.target;
        const seatId = seat.dataset.seatId;
        
        if (seat.classList.contains('selected')) {
            seat.classList.remove('selected');
            seat.classList.add('available');
            selectedSeats = selectedSeats.filter(s => s !== seatId);
        } else if (seat.classList.contains('available')) {
            seat.classList.remove('available');
            seat.classList.add('selected');
            selectedSeats.push(seatId);
        }
        
        updateBookingSummary();
    }

    // Update booking summary
    function updateBookingSummary() {
        if (selectedSeats.length === 0) {
            selectedSeatsText.textContent = 'None';
            totalPriceText.textContent = '0';
            confirmBookingBtn.disabled = true;
        } else {
            selectedSeatsText.textContent = selectedSeats.sort().join(', ');
            totalPriceText.textContent = selectedSeats.length * seatPrice;
            confirmBookingBtn.disabled = false;
        }
    }

    // Close modal
    closeModal.addEventListener('click', () => {
        seatingModal.classList.add('hidden-modal');
    });

    // Click outside modal to close
    seatingModal.addEventListener('click', (e) => {
        if (e.target === seatingModal) {
            seatingModal.classList.add('hidden-modal');
        }
    });

    // Confirm booking
    confirmBookingBtn.addEventListener('click', () => {
        const movieTitle = movieTitleText.textContent.replace('Select Your Seats - ', '');
        const totalPrice = selectedSeats.length * seatPrice;
        alert(`Booking confirmed!\nMovie: ${movieTitle}\nSeats: ${selectedSeats.sort().join(', ')}\nTotal Price: ₹${totalPrice}`);
        
        // Store booked seats for this movie
        if (!movieBookings[movieTitle]) {
            movieBookings[movieTitle] = [];
        }
        movieBookings[movieTitle].push(...selectedSeats);
        
        seatingModal.classList.add('hidden-modal');
        selectedSeats = [];
        generateSeats();
        updateBookingSummary();
    });

    // Handle book button clicks
    bookButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const movieTitle = button.getAttribute('data-movie');
            currentMovie = movieTitle; // Set current movie
            movieTitleText.textContent = `Select Your Seats - ${movieTitle}`;
            seatingModal.classList.remove('hidden-modal');
            generateSeats();
            updateBookingSummary();
        });
    });
});