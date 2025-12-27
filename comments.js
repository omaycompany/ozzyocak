// Simple comment system with math captcha
class CommentSystem {
    constructor() {
        this.mathQuestions = [
            { q: "30 + 31", a: 61 },
            { q: "15 + 27", a: 42 },
            { q: "50 - 18", a: 32 },
            { q: "12 × 3", a: 36 },
            { q: "45 + 23", a: 68 },
            { q: "100 - 37", a: 63 }
        ];
        this.currentQuestion = null;
    }

    // Get random math question
    getRandomQuestion() {
        this.currentQuestion = this.mathQuestions[Math.floor(Math.random() * this.mathQuestions.length)];
        return this.currentQuestion;
    }

    // Validate answer
    validateAnswer(answer) {
        return parseInt(answer) === this.currentQuestion.a;
    }

    // Load comments for a post
    async loadComments(postId) {
        try {
            const response = await fetch('comments.json');
            const data = await response.json();
            return data.posts[postId]?.comments || [];
        } catch (error) {
            console.error('Error loading comments:', error);
            return [];
        }
    }

    // Render comments
    renderComments(comments, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (comments.length === 0) {
            container.innerHTML = '<p class="no-comments">no comments yet. be the first!</p>';
            return;
        }

        const commentsHTML = comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <strong class="comment-author">${this.escapeHtml(comment.name)}</strong>
                    <time class="comment-date">${new Date(comment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                </div>
                <p class="comment-text">${this.escapeHtml(comment.text)}</p>
            </div>
        `).join('');

        container.innerHTML = commentsHTML;
    }

    // Render comment form
    renderForm(postId, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const question = this.getRandomQuestion();

        container.innerHTML = `
            <form class="comment-form" id="comment-form-${postId}">
                <input 
                    type="text" 
                    id="comment-name-${postId}" 
                    placeholder="your name" 
                    required
                    maxlength="50"
                />
                <textarea 
                    id="comment-text-${postId}" 
                    placeholder="your comment" 
                    required
                    maxlength="500"
                    rows="3"
                ></textarea>
                <div class="captcha-row">
                    <label class="captcha-label">
                        what is ${question.q}?
                        <input 
                            type="number" 
                            id="comment-captcha-${postId}" 
                            required
                            placeholder="answer"
                        />
                    </label>
                    <button type="submit" class="submit-btn">submit comment</button>
                </div>
                <p class="form-note">comments are manually reviewed before appearing</p>
            </form>
        `;

        // Handle form submission
        document.getElementById(`comment-form-${postId}`).addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(postId);
        });
    }

    // Handle form submission
    handleSubmit(postId) {
        const name = document.getElementById(`comment-name-${postId}`).value.trim();
        const text = document.getElementById(`comment-text-${postId}`).value.trim();
        const captcha = document.getElementById(`comment-captcha-${postId}`).value;

        // Validate captcha
        if (!this.validateAnswer(captcha)) {
            alert('❌ wrong answer! try again.');
            document.getElementById(`comment-captcha-${postId}`).value = '';
            document.getElementById(`comment-captcha-${postId}`).focus();
            return;
        }

        // Create comment JSON
        const commentJson = JSON.stringify({
            name: name,
            text: text,
            date: new Date().toISOString()
        }, null, 2);

        // Create GitHub issue URL - FIXED REPO NAME
        const issueTitle = `New Comment: ${postId}`;
        const issueBody = `**Name:** ${name}
**Post ID:** ${postId}
**Date:** ${new Date().toISOString()}

**Comment:**
${text}

---
To approve this comment, add it to \`comments.json\`:
\`\`\`json
${commentJson}
\`\`\``;

        const githubUrl = `https://github.com/omaycompany/ozzyocak/issues/new?title=${encodeURIComponent(issueTitle)}&body=${encodeURIComponent(issueBody)}`;

        // Show success message with GitHub + backup options
        const formContainer = document.getElementById(`comment-form-${postId}`).parentElement;
        formContainer.innerHTML = `
            <div class="comment-success">
                <p>✅ <strong>thanks for your comment!</strong></p>
                <a href="${githubUrl}" target="_blank" class="github-submit-btn">
                    submit via github →
                </a>
                <p class="form-note">click the button above to submit your comment</p>
            </div>
        `;
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize comment system
const commentSystem = new CommentSystem();
