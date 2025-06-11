// Function to load modal content from GitHub raw content URL
async function loadExternalModalContent(modalId, modalType) {
    const modalElement = document.getElementById(modalId);
    
    if (!modalElement) {
        console.error(`Modal element with ID ${modalId} not found.`);
        return;
    }
    
    // Use GitHub raw content URL - properly encode URL components
    const githubRawBaseUrl = "https://raw.githubusercontent.com/realnamesareboring/ATT4CKQL/main/";
    const modalPath = `${githubRawBaseUrl}Amazon%20Web%20Services/_${modalType}/${modalId}.html`;
    
    console.log(`Loading from GitHub: ${modalPath}`);
    
    try {
        // Show loading indicator and display the modal
        modalElement.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="closeModal('${modalId}')">&times;</span>
                <div class="modal-loading">Loading content...</div>
            </div>
        `;
        modalElement.style.display = "block";
        
        // Fetch the modal content from GitHub
        const response = await fetch(modalPath);
        
        if (!response.ok) {
            console.error(`GitHub fetch failed: ${modalPath}. Status: ${response.status}`);
            throw new Error(`Could not load content (Status: ${response.status})`);
        }
        
        const modalContent = await response.text();
        console.log(`Content loaded successfully`);
        
        // Process the content to ensure proper modal structure
        let processedContent = modalContent;
        
        // Wrap the content in proper modal structure if it's not already wrapped
        if (!processedContent.includes('modal-content')) {
            processedContent = `
                <div class="modal-content">
                    <span class="close-btn" onclick="closeModal('${modalId}')">&times;</span>
                    <div class="modal-body">
                        ${processedContent}
                    </div>
                </div>
            `;
        } else {
            // Ensure close button has proper onclick handler and is always present
            processedContent = processedContent.replace(
                /onclick="closeModal\('([^']+)'\)"/g,
                `onclick="closeModal('${modalId}')"`
            );
            
            // Always ensure there's a close button at the top level
            if (!processedContent.includes('close-btn')) {
                processedContent = processedContent.replace(
                    /<div class="modal-content"([^>]*)>/,
                    `<div class="modal-content"$1><span class="close-btn" onclick="closeModal('${modalId}')">&times;</span>`
                );
            }
            
            // Ensure content is wrapped in modal-body if it's not already
            if (!processedContent.includes('modal-body') && processedContent.includes('<div class="modal-content">')) {
                // Extract content between modal-content tags, preserving the close button
                const contentMatch = processedContent.match(/<div class="modal-content"[^>]*>(.*)<\/div>/s);
                if (contentMatch) {
                    const innerContent = contentMatch[1];
                    
                    // Extract close button if it exists
                    const closeBtnMatch = innerContent.match(/(<span class="close-btn"[^>]*>.*?<\/span>)/);
                    const closeBtnHtml = closeBtnMatch ? closeBtnMatch[1] : `<span class="close-btn" onclick="closeModal('${modalId}')">&times;</span>`;
                    
                    // Remove existing close button from content to avoid duplication
                    const contentWithoutCloseBtn = innerContent.replace(/<span class="close-btn"[^>]*>.*?<\/span>/g, '');
                    
                    processedContent = `
                        <div class="modal-content">
                            ${closeBtnHtml}
                            <div class="modal-body">
                                ${contentWithoutCloseBtn}
                            </div>
                        </div>
                    `;
                }
            }
        }
        
        // Add table wrapper for better scrolling if log tables are present
        if (processedContent.includes('log-table') && !processedContent.includes('table-wrapper')) {
            processedContent = processedContent.replace(
                /<table class="log-table"/g,
                '<div class="table-wrapper"><table class="log-table"'
            );
            processedContent = processedContent.replace(
                /<\/table>/g,
                '</table></div>'
            );
        }
        
        // Set the processed content
        modalElement.innerHTML = processedContent;
    } catch (error) {
        console.error('Error loading content:', error);
        modalElement.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="closeModal('${modalId}')">&times;</span>
                <div class="modal-header">
                    <div class="modal-title">Error Loading Content</div>
                </div>
                <div class="modal-body">
                    <p>There was an error loading the content: ${error.message}</p>
                    <p>URL attempted: ${modalPath}</p>
                    <p>Note: This page loads content directly from GitHub. Make sure the file exists in the repository.</p>
                </div>
            </div>
        `;
    }
}

// Function to open external modals
function openExternalModal(modalId, modalType) {
    loadExternalModalContent(modalId, modalType);
}

// Function to open modal (for backward compatibility)
function openModal(modalId) {
    loadExternalModalContent(modalId, 'logs');
}

// Function to open query modal with specific GitHub path
function openQueryModal(modalId, githubPath) {
    // Show loading message and display the modal
    const modalElement = document.getElementById(modalId);
    modalElement.innerHTML = `
        <div class="modal-content">
            <span class="close-btn" onclick="closeModal('${modalId}')">&times;</span>
            <div class="modal-loading">Loading query...</div>
        </div>
    `;
    modalElement.style.display = "block";
    
    // Then fetch the KQL query with corrected path
    // Add "Amazon Web Services/Queries/" prefix if not already present
    if (!githubPath.includes('Queries/')) {
        githubPath = `Amazon Web Services/Queries/${githubPath.split('/').pop()}`;
    }
    
    fetchQueryWithShellDisplay(modalId, githubPath);
}

// Function to close modal
function closeModal(modalId) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
        modalElement.style.display = "none";
    } else {
        console.error(`Modal with ID ${modalId} not found`);
    }
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Function to fetch explanation content
async function fetchExplanationContent(modalId) {
    try {
        let explanationId = modalId;
        console.log("Original modalId:", modalId);
        
        // If modalId starts with 'aws-', remove it
        if (modalId.startsWith('aws-')) {
            explanationId = modalId.substring(4); // Remove 'aws-' prefix
            console.log("After removing 'aws-' prefix:", explanationId);
        }
        
        // If explanationId ends with '-kql', remove it
        if (explanationId.endsWith('-kql')) {
            explanationId = explanationId.substring(0, explanationId.length - 4);
            console.log("After removing '-kql' suffix:", explanationId);
        }
        
        const baseUrl = "https://raw.githubusercontent.com/realnamesareboring/ATT4CKQL/main/";
        const explanationPath = `${baseUrl}Amazon%20Web%20Services/_explained/${explanationId}-kqlexplained.html`;
        
        console.log(`Fetching explanation from: ${explanationPath}`);
        
        const response = await fetch(explanationPath);
        
        if (!response.ok) {
            console.error(`Failed to fetch explanation. Status: ${response.status}`);
            return `
                <div class='explanation'>
                    <h3>Query Explanation</h3>
                    <p>Explanation not available for this query yet. Please check back later or contact the administrator.</p>
                </div>
            `;
        }
        
        const explanationContent = await response.text();
        console.log("Explanation content successfully loaded");
        
        // If the content doesn't already have the explanation class, wrap it
        if (!explanationContent.includes('class="explanation"')) {
            return `<div class="explanation">${explanationContent}</div>`;
        }
        
        return explanationContent;
    } catch (error) {
        console.error("Error fetching explanation:", error);
        return `
            <div class='explanation'>
                <h3>Query Explanation</h3>
                <p>Error loading explanation. Please try again later.</p>
            </div>
        `;
    }
}

// Function to fetch KQL query with shell-like display
async function fetchQueryWithShellDisplay(modalId, githubPath) {
    const modalElement = document.getElementById(modalId);
    const baseUrl = "https://raw.githubusercontent.com/realnamesareboring/ATT4CKQL/main/";
    const fileName = githubPath.split('/').pop(); // Declare fileName once at the top
    
    try {
        // Properly encode URL components
        const encodedPath = encodeURI(githubPath).replace(/ /g, '%20');
        const fullUrl = baseUrl + encodedPath;
        
        console.log(`Fetching KQL query from: ${fullUrl}`);
        
        const response = await fetch(fullUrl);
        
        if (!response.ok) {
            // Try an alternative path with different formatting
            const altPath = `Amazon Web Services/Queries/${fileName}`;
            const encodedAltPath = encodeURI(altPath).replace(/ /g, '%20');
            const altUrl = baseUrl + encodedAltPath;
            
            console.log(`Trying alternative path: ${altUrl}`);
            
            const altResponse = await fetch(altUrl);
            
            if (!altResponse.ok) {
                throw new Error(`HTTP error! Status: ${response.status}/${altResponse.status}`);
            }
            
            const queryContent = await altResponse.text();
            await processQueryContent(modalId, queryContent, fileName);
            return;
        }
        
        const queryContent = await response.text();
        await processQueryContent(modalId, queryContent, fileName);
        
    } catch (error) {
        console.error("Error fetching KQL query:", error);
        modalElement.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="closeModal('${modalId}')">&times;</span>
                <div class="modal-header">
                    <div class="modal-title">Error Loading Query</div>
                </div>
                <div class="modal-body">
                    <p>There was an error loading the query: ${error.message}</p>
                    <p>URL attempted: ${baseUrl + encodeURI(githubPath).replace(/ /g, '%20')}</p>
                    <p>Note: This page loads content directly from GitHub. Make sure the KQL file exists in the repository.</p>
                    <p>Expected path: Amazon Web Services/Queries/[filename].kql</p>
                    <p>You can try viewing the repository directly: <a href="https://github.com/realnamesareboring/ATT4CKQL/tree/main/Amazon%20Web%20Services/Queries" target="_blank">GitHub Repository Queries</a></p>
                </div>
            </div>
        `;
    }
}

// Helper function to process and display query content with explanation
async function processQueryContent(modalId, queryContent, fileName) {
    const modalElement = document.getElementById(modalId);
    
    // Store the query content for copying
    window[`${modalId}_content`] = queryContent;
    
    // Fetch the explanation content
    const explanationContent = await fetchExplanationContent(modalId);
    
    // Create a shell-styled modal with the query content and explanation
    modalElement.innerHTML = `
        <div class="modal-content">
            <span class="close-btn" onclick="closeModal('${modalId}')">&times;</span>
            <div class="modal-header">
                <div class="modal-title">${fileName.replace('.kql', ' - Detection Query')}</div>
            </div>
            <div class="modal-body">
                <div class="query-container">
                    <div class="query-header">
                        <div class="query-title">Microsoft Sentinel KQL Query</div>
                        <button class="copy-btn" onclick="copyQueryToClipboard('${modalId}')">Copy Query</button>
                    </div>
                    <div class="code-wrapper">
                        <pre class="code-block" id="${modalId}-code">${escapeHtml(queryContent)}</pre>
                    </div>
                </div>
                
                ${explanationContent}
            </div>
        </div>
    `;
}

// Function to copy query to clipboard
function copyQueryToClipboard(modalId) {
    const queryContent = window[`${modalId}_content`];
    
    if (!queryContent) {
        console.error('No query content found to copy');
        return;
    }
    
    navigator.clipboard.writeText(queryContent).then(function() {
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        copyBtn.style.background = '#107c10'; // Azure success green
        setTimeout(function() {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    }).catch(function(err) {
        console.error('Unable to copy text: ', err);
        alert('Failed to copy. Please try again.');
    });
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for (let i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            modals[i].style.display = "none";
        }
    }
}

// Initialize event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded. Modal functionality initialized.');
    console.log('Loading content directly from GitHub repository.');
    
    // Add a notice at the top of the page (updated styling)
    const notice = document.createElement('div');
    notice.style.background = '#fff3cd';
    notice.style.color = '#856404';
    notice.style.padding = '12px 16px';
    notice.style.marginBottom = '20px';
    notice.style.borderRadius = '6px';
    notice.style.border = '1px solid #ffeeba';
    notice.style.fontSize = '13px';
    notice.innerHTML = `
        <strong>📡 GitHub Integration:</strong> This page loads content directly from the GitHub repository.
        Internet connection is required for all functionality to work properly.
        <button id="test-github" style="margin-left: 12px; padding: 4px 12px; background: #ffc107; border: 1px solid #856404; border-radius: 4px; cursor: pointer; font-size: 12px;">Test Connection</button>
    `;
    
    const firstElement = document.body.firstChild;
    document.body.insertBefore(notice, firstElement);
    
    // Add event listener for test button
    document.getElementById('test-github').addEventListener('click', function() {
        const testUrl = "https://raw.githubusercontent.com/realnamesareboring/ATT4CKQL/main/README.md";
        fetch(testUrl)
            .then(response => {
                if (response.ok) {
                    alert('✅ GitHub connection successful! Repository is accessible.');
                } else {
                    alert(`❌ GitHub connection failed! Status: ${response.status}. Repository might not exist or be private.`);
                }
            })
            .catch(error => {
                alert(`⚠️ GitHub connection error: ${error.message}. Check your internet connection.`);
            });
    });
    
    // Apply theme if stored in session storage
    const savedTheme = sessionStorage.getItem('att4ckql-theme');
    if (savedTheme === 'attacker') {
        document.body.classList.add('theme-attacker');
    }
    
    // Add event listener for theme toggle if it exists
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (document.body.classList.contains('theme-attacker')) {
                document.body.classList.remove('theme-attacker');
                sessionStorage.setItem('att4ckql-theme', 'defender');
            } else {
                document.body.classList.add('theme-attacker');
                sessionStorage.setItem('att4ckql-theme', 'attacker');
            }
        });
    }
});