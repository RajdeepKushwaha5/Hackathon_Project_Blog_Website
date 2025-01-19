document.addEventListener('DOMContentLoaded', () => {
    let searchContainer = document.querySelector('.search-container');
    if (!searchContainer) {
        searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <form class="search-form" onsubmit="event.preventDefault();">
                <input type="search" id="searchInput" class="search-input" placeholder="Search articles..." aria-label="Search">
                <button type="button" class="search-close" aria-label="Close search">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </form>
        `;
        document.querySelector('.site-header').appendChild(searchContainer);
    }

    // Select elements
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    const searchToggle = document.querySelector('.search-toggle');
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect');
    const articlesGrid = document.getElementById('articlesGrid');
    const articles = articlesGrid ? articlesGrid.getElementsByClassName('article-card') : [];
    
    // Search toggle functionality
    const searchClose = searchContainer.querySelector('.search-close');
    
    searchToggle.addEventListener('click', () => {
        searchContainer.classList.toggle('active');
        searchContainer.querySelector('.search-input').focus();
    });
    
    searchClose.addEventListener('click', () => {
        searchContainer.classList.remove('active');
    });
    
    // Close search on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchContainer.classList.contains('active')) {
            searchContainer.classList.remove('active');
        }
    });

    // Filter articles by search and category 
    function filterArticles() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value;

        Array.from(articles).forEach(article => {
            const title = article.querySelector('h3').textContent.toLowerCase();
            const category = article.getAttribute('data-category');

            const matchesSearch = title.includes(searchTerm);
            const matchesCategory = selectedCategory === '' || category === selectedCategory;

            if (matchesSearch && matchesCategory) {
                article.style.display = ''; 
            } else {
                article.style.display = 'none'; 
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterArticles);
    }
    if (categorySelect) {
        categorySelect.addEventListener('change', filterArticles);
    }


    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    
    // Add fade-in animation to articles when they come into view
    const observeElements = document.querySelectorAll('.article-card');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        },
        { threshold: 0.1 }
    );

    observeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(element);
    });

    const carouselTrack = document.querySelector('.carousel-track');
    const carouselItems = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    let autoplayInterval;

    // Clone the first few items for circular rotation
    const firstItem = carouselItems[0].cloneNode(true);
    const secondItem = carouselItems[1].cloneNode(true);
    carouselTrack.appendChild(firstItem);
    carouselTrack.appendChild(secondItem);

    function updateCarousel() {
        const offset = -currentIndex * (carouselItems[0].clientWidth + 20); 
        carouselTrack.style.transform = `translateX(${offset}px)`;

        // Reset index if we reach the cloned items
        if (currentIndex >= carouselItems.length) {
            currentIndex = 0;
            carouselTrack.style.transition = 'none'; 
            carouselTrack.style.transform = `translateX(0px)`; 
            setTimeout(() => {
                carouselTrack.style.transition = 'transform 0.5s ease-in-out'; 
            }, 50); 
        }
    }

    function nextSlide() {
        currentIndex++;
        updateCarousel();
    }

    // Autoplay functionality with increased speed
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 2000); 
    }

    // Start autoplay on page load
    startAutoplay();

    // Add touch support for mobile devices
    let startX;     carouselTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    carouselTrack.addEventListener('touchmove', (e) => {
        const moveX = e.touches[0].clientX - startX;
        if (moveX > 50) {
            currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length; 
            updateCarousel();
            startX = null; 
        } else if (moveX < -50) {
            nextSlide(); 
            startX = null; 
        }
    });

    // Check if observer is already declared
    if (typeof observer === 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible'); 
                    observer.unobserve(entry.target); 
                }
            });
        }, { threshold: 0.1 });

        // Observe all relevant elements
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach(item => observer.observe(item));

        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => observer.observe(card));

        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => observer.observe(item));
    }

    const faqToggles = document.querySelectorAll('.faq-toggle');

    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const content = toggle.nextElementSibling;
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

            toggle.setAttribute('aria-expanded', !isExpanded);
            content.setAttribute('aria-hidden', isExpanded);
            content.classList.toggle('visible', !isExpanded);
            content.style.maxHeight = isExpanded ? '0' : `${content.scrollHeight}px`;
        });
    });

    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const terms = document.getElementById('terms').checked;

        // Simple validation
        if (!name || !email || !message || !terms) {
            alert('Please fill in all fields and accept the terms.');
            return;
        }

        // Here you can handle the form data, e.g., send it to a server
        console.log('Form submitted:', { name, email, message });

        // Clear the form fields
        this.reset();
        alert('Thank you for your message!');
    });

    const newsletterForm = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('newsletterEmail');

    newsletterForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const email = emailInput.value.trim();

        // Validate email
        if (validateEmail(email)) {
            // Handle valid email submission (e.g., send it to a server)
            console.log('Email submitted:', email);
            alert('Thank you for subscribing to our newsletter!');
            this.reset(); 
        } else {
            alert('Please enter a valid email address.');
        }
    });

    function validateEmail(email) {
        // Simple regex for email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Note-Taking functionality
    const noteInput = document.getElementById('noteInput');
    const saveNoteButton = document.getElementById('saveNote');
    const notesList = document.getElementById('notesList');

    saveNoteButton.addEventListener('click', () => {
        const note = noteInput.value.trim();
        if (note) {
            const listItem = document.createElement('li');
            listItem.classList.add('note-item');

            // Create radio button
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'note';
            radio.classList.add('note-radio');

            // Create label for the note
            const label = document.createElement('label');
            label.textContent = note;
            label.classList.add('note-label');

            // Create delete button (cross mark)
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '✖'; // Cross mark
            deleteButton.classList.add('delete-note');

            // Append radio, label, and delete button to the list item
            listItem.appendChild(radio);
            listItem.appendChild(label);
            listItem.appendChild(deleteButton);
            notesList.appendChild(listItem);

            // Clear the input field
            noteInput.value = '';

            // Add event listener to radio button for crossing out text
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    label.classList.toggle('crossed'); // Toggle the crossed class
                }
            });

            // Add event listener to delete button
            deleteButton.addEventListener('click', () => {
                notesList.removeChild(listItem);
            });
        } else {
            alert('Please enter a note before saving.');
        }
    });

    // Text Editor functionality
    const blogContent = document.getElementById('blogContent');

    // Function to format text
    function formatText(command, value = null) {
        document.execCommand(command, false, value);
        blogContent.focus();
    }

    document.getElementById('boldBtn').addEventListener('click', () => formatText('bold'));
    document.getElementById('italicBtn').addEventListener('click', () => formatText('italic'));
    document.getElementById('underlineBtn').addEventListener('click', () => formatText('underline'));
    document.getElementById('h1Btn').addEventListener('click', () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const h1 = document.createElement('h1');
            h1.textContent = range.toString(); 
            range.deleteContents(); 
            range.insertNode(h1);
            blogContent.focus();
        } else {
            // If no text is selected, create an empty H1
            const h1 = document.createElement('h1');
            h1.textContent = 'New Heading'; 
            blogContent.appendChild(h1);
            blogContent.focus();
        }
    });
    document.getElementById('h2Btn').addEventListener('click', () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const h2 = document.createElement('h2');
            h2.textContent = range.toString(); 
            range.deleteContents(); 
            range.insertNode(h2);
            blogContent.focus();
        } else {
            // If no text is selected, create an empty H2
            const h2 = document.createElement('h2');
            h2.textContent = 'New Subheading';
            blogContent.appendChild(h2);
            blogContent.focus();
        }
    });
    document.getElementById('bulletBtn').addEventListener('click', () => formatText('insertUnorderedList'));

    // Save button functionality
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', () => {
        const content = blogContent.innerHTML.trim();
        if (content) {
            // Here you can implement saving logic, e.g., send to server or local storage
            alert('Content saved: ' + content);
        } else {
            alert('Please write something before saving.');
        }
    });

    // Post button functionality
    const postBtn = document.getElementById('postBtn');
    postBtn.addEventListener('click', () => {
        const content = blogContent.innerHTML.trim();
        if (content) {
            alert('Post submitted: ' + content);
        } else {
            alert('Please write something before posting.');
        }
    });

    // Button event listeners
    const buttons = document.querySelectorAll('.editor-controls button, .editor-actions button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            buttons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.remove('button-active'); 
            });
            // Add active class to the clicked button
            button.classList.add('active');
            button.classList.add('button-active'); 
        });
    });
});


// sign in form validation 
function validateForm(event) {
    const username = document.querySelector('input[type="text"]');
    const password = document.querySelector('input[type="password"]');

    if (username.value.trim() === '' || password.value.trim() === '') {
        event.preventDefault(); 
        alert('Please fill in both fields.');
    }
}


