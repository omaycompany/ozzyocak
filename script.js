document.addEventListener('DOMContentLoaded', () => {
    console.log('ozzy blog loaded');

    const posts = document.querySelectorAll('.post');

    posts.forEach(post => {
        const header = post.querySelector('.post-header');

        if (header) {
            header.addEventListener('click', (e) => {
                // toggle the expanded class on the main post element
                post.classList.toggle('is-expanded');
            });
        }
    });

    // scroll reveal logic
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.05
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.post').forEach(post => {
        post.style.opacity = '0';
        post.style.transform = 'translateY(15px)';
        post.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(post);
    });
});
