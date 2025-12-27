document.addEventListener('DOMContentLoaded', () => {
    console.log('ozzy blog loaded');

    const posts = document.querySelectorAll('.post');

    posts.forEach(post => {
        const header = post.querySelector('.post-header');

        if (header) {
            header.addEventListener('click', async (e) => {
                // toggle the expanded class on the main post element
                post.classList.toggle('is-expanded');

                // Initialize comments when post is expanded
                if (post.classList.contains('is-expanded')) {
                    // Find comments containers in this post
                    const commentsDiv = post.querySelector('[id^="comments-"]');
                    const formDiv = post.querySelector('[id^="comment-form-container-"]');

                    if (commentsDiv && formDiv && !formDiv.hasAttribute('data-initialized')) {
                        // Extract post ID from the div id
                        const postId = commentsDiv.id.replace('comments-', '');

                        // Load and render comments
                        const comments = await commentSystem.loadComments(postId);
                        commentSystem.renderComments(comments, commentsDiv.id);
                        commentSystem.renderForm(postId, formDiv.id);

                        // Mark as initialized
                        formDiv.setAttribute('data-initialized', 'true');
                    }
                }
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
