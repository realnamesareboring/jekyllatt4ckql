/**
 * AWS Script - Complete Updated Version for Local File Loading
 * Updated to use local Jekyll-served files instead of GitHub API
 */

// Function to load modal content from Jekyll-served files (UPDATED)
async function loadExternalModalContent(modalId, modalType) {
    const modalElement = document.getElementById(modalId);
    
    if (!modalElement) {
        console.error(`Modal element with ID ${modalId} not found.`);
        return;
    }
    
    // UPDATED: Use renamed directories (without underscores)
    const modalPath = `/Amazon Web Services/logs/${modalId}.html`;
    
    console.log(`Loading from local Jekyll: ${modalPath}`);
    
    try {
        // Show loading indicator and display the modal
        modalElement.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="closeModal('${modalId}')">&times;</span>
                <div class="modal-loading">Loading content...</div>
            </div>
        `;
        modalElement.style.display = "block";
        
        // Fetch the modal content from Jekyll-served files
        const response = await fetch(modalPath);
        
        if (!response.ok) {
            console.error(`Local fetch failed: ${modalPath}. Status: ${response.status}`);
            modalElement.innerHTML = `
                <div class="modal-content">
                    <span class="close-btn" onclick="closeModal('${modalId}')">&times;</span>
                    <div class="modal-header">
                        <div class="modal-title">Error Loading Content</div>
                    </div>
                    <div class="modal-body">
                        <p>Could not load sample logs content.</p>
                        <p>Path attempted: ${modalPath}</p>
                        <p>Make sure the file exists in the repository.</p>
                    </div>
                </div>
            `;
            return;
        }
        
        const modalContent = await response.text();
        console.log(`Content loaded successfully from Jekyll`);
        
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
                    <p>Path attempted: ${modalPath}</p>
                    <p>Content is served locally from Jekyll.</p>
                </div>
            </div>
        `;
    }
}

// Function to fetch KQL query from Jekyll-served files (UPDATED)
async function fetchQueryWithShellDisplay(modalId, githubPath) {
    const modalElement = document.getElementById(modalId);
    const fileName = githubPath.split('/').pop(); // Extract just the filename
    
    try {
        // UPDATED: Use platform-specific local path instead of GitHub API
        const queryPath = `/Amazon Web Services/Queries/${fileName}`;
        
        console.log(`Fetching KQL query from local Jekyll: ${queryPath}`);
        
        const response = await fetch(queryPath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const queryContent = await response.text();
        
        // Process the content and display with explanation
        await processQueryContent(modalId, queryContent, fileName);
        
    } catch (error) {
        console.error('Error fetching query:', error);
        modalElement.innerHTML = `
            <div class="modal-content">
                <span class="close-btn" onclick="closeModal('${modalId}')">&times;</span>
                <div class="modal-header">
                    <div class="modal-title">Error Loading Query</div>
                </div>
                <div class="modal-body">
                    <p>There was an error loading the KQL query: ${error.message}</p>
                    <p>Path attempted: /Amazon Web Services/Queries/${fileName}</p>
                    <p>Make sure the KQL file exists in the repository.</p>
                    <p>Expected path: Amazon Web Services/Queries/[filename].kql</p>
                    <p>You can try viewing the repository directly: <a href="https://github.com/realnamesareboring/ATT4CKQL/tree/main/Amazon%20Web%20Services/Queries" target="_blank">GitHub Repository Queries</a></p>
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

// Function to fetch explanation content (STILL USES GITHUB - explanations not migrated)
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
        
        // UPDATED: Use local explained files instead of GitHub API
        const explanationPath = `/Amazon Web Services/explained/${explanationId}-kqlexplained.html`;
        
        console.log(`Fetching explanation from local Jekyll: ${explanationPath}`);
        
        const response = await fetch(explanationPath);
        
        if (!response.ok) {
            console.error(`Failed to fetch explanation from local Jekyll. Status: ${response.status}`);
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
                <div class="modal-actions">
                    <button onclick="copyQueryToClipboard('${modalId}')" class="copy-btn">📋 Copy Query</button>
                    <button onclick="fetchExplanationContent('${modalId}')" class="explain-btn">📖 Explain Query</button>
                </div>
            </div>
            <div class="modal-body">
                <div class="query-container">
                    <div class="shell-header">
                        <div class="shell-controls">
                            <span class="shell-control close"></span>
                            <span class="shell-control minimize"></span>
                            <span class="shell-control maximize"></span>
                        </div>
                        <div class="shell-title">Microsoft Sentinel - KQL Query</div>
                    </div>
                    <div class="shell-content">
                        <pre class="kql-query" id="query-${modalId}"><code>${escapeHtml(queryContent)}</code></pre>
                    </div>
                </div>
                <div class="query-explanation" id="explanation-${modalId}">
                    ${explanationContent}
                </div>
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
        const copyBtn = document.querySelector(`#${modalId} .copy-btn`);
        if (copyBtn) {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "✅ Copied!";
            copyBtn.style.background = '#107c10'; // Azure success green
            setTimeout(function() {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '';
            }, 2000);
        }
    }).catch(function(err) {
        console.error('Unable to copy text: ', err);
        alert('Failed to copy. Please try again.');
    });
}