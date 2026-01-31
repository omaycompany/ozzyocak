document.addEventListener('DOMContentLoaded', () => {
    console.log('ozzy blog loaded');

    const posts = document.querySelectorAll('.post');

    // Function to expand a post
    const expandPost = async (post) => {
        if (!post) return;

        post.classList.add('is-expanded');

        // Initialize comments when post is expanded
        const commentsDiv = post.querySelector('[id^="comments-"]');
        const formDiv = post.querySelector('[id^="comment-form-container-"]');

        if (commentsDiv && formDiv && !formDiv.hasAttribute('data-initialized')) {
            const postId = commentsDiv.id.replace('comments-', '');
            const comments = await commentSystem.loadComments(postId);
            commentSystem.renderComments(comments, commentsDiv.id);
            commentSystem.renderForm(postId, formDiv.id);
            formDiv.setAttribute('data-initialized', 'true');
        }
    };

    posts.forEach(post => {
        const header = post.querySelector('.post-header');
        const shareBtn = post.querySelector('.share-btn');

        if (header) {
            header.addEventListener('click', async (e) => {
                // toggle the expanded class on the main post element
                post.classList.toggle('is-expanded');

                // Initialize comments when post is expanded
                if (post.classList.contains('is-expanded')) {
                    expandPost(post);
                }
            });
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = post.id;
                const url = new URL(window.location.href);
                url.hash = id;

                navigator.clipboard.writeText(url.href).then(() => {
                    shareBtn.textContent = '';
                    shareBtn.classList.add('copied');
                    setTimeout(() => {
                        shareBtn.classList.remove('copied');
                        shareBtn.textContent = 'share';
                    }, 2000);
                });
            });
        }
    });

    // Handle initial hash on load
    const handleHash = () => {
        const hash = window.location.hash;
        if (hash) {
            const id = hash.substring(1); // remove #
            const targetPost = document.getElementById(id);
            if (targetPost && targetPost.classList.contains('post')) {
                expandPost(targetPost);
                // Scroll to target with a slight delay to ensure expansion starts
                setTimeout(() => {
                    targetPost.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHash);

    // Check hash on initial load
    handleHash();

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
