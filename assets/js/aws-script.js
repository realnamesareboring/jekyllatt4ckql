/**
 * AWS Script - Complete Fixed Version with Baseurl Support for GitHub Pages
 * Includes all original functionality plus baseurl path fixes
 */

// Helper function to get the correct path with baseurl
function getBasePath(path) {
    const baseUrl = window.siteBaseUrl || '';
    return baseUrl + path;
}

// Function to load modal content from Jekyll-served files
async function loadExternalModalContent(modalId, modalType) {
    const modalElement = document.getElementById(modalId);
    
    if (!modalElement) {
        console.error(`Modal element with ID ${modalId} not found.`);
        return;
    }
    
    // Use local Jekyll paths with baseurl (FIXED)
    const modalPath = getBasePath(`/Amazon Web Services/logs/${modalId}.html`);
    
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

// Function to fetch KQL query from Jekyll-served files (FIXED with baseurl)
async function fetchQueryWithShellDisplay(modalId, githubPath) {
    const modalElement = document.getElementById(modalId);
    const fileName = githubPath.split('/').pop(); // Extract just the filename
    
    try {
        // Use local Jekyll path with baseurl (FIXED)
        const queryPath = getBasePath(`/Amazon Web Services/Queries/${fileName}`);
        
        console.log(`Fetching KQL query from local Jekyll: ${queryPath}`);
        
        const response = await fetch(queryPath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const queryContent = await response.text();
        
        // Remove any front matter from Jekyll files
        const cleanedQuery = queryContent.replace(/^---[\s\S]*?---\s*/m, '').trim();
        
        // Process the content and display with explanation
        await processQueryContent(modalId, cleanedQuery, fileName);
        
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
                    <p>Path attempted: ${getBasePath(`/Amazon Web Services/Queries/${fileName}`)}</p>
                    <p>Make sure the KQL file exists in the repository.</p>
                </div>
            </div>
        `;
    }
}

// Function to fetch explanation content from local Jekyll files (FIXED with baseurl)
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
        
        // Use local Jekyll path for explanations with baseurl (FIXED)
        const explanationPath = getBasePath(`/Amazon Web Services/explained/${explanationId}-kqlexplained.html`);
        
        console.log(`Fetching explanation from local Jekyll: ${explanationPath}`);
        
        const response = await fetch(explanationPath);
        
        if (!response.ok) {
            console.error(`Failed to fetch explanation from local Jekyll. Status: ${response.status}`);
            return `
                <div class='explanation' id="explanation-section">
                    <h3>Query Explanation</h3>
                    <p>Explanation not available for this query yet.</p>
                </div>
            `;
        }
        
        const explanationContent = await response.text();
        console.log("Explanation content successfully loaded");
        
        // Ensure explanation content is properly wrapped with class and ID
        let wrappedContent = explanationContent;
        
        // If content doesn't have explanation class, wrap it
        if (!wrappedContent.includes('class="explanation"')) {
            wrappedContent = `<div class="explanation" id="explanation-section">${wrappedContent}</div>`;
        } else {
            // Ensure it has an ID for scrolling
            if (!wrappedContent.includes('id="explanation-section"')) {
                wrappedContent = wrappedContent.replace(
                    '<div class="explanation"', 
                    '<div class="explanation" id="explanation-section"'
                );
            }
        }
        
        return wrappedContent;
    } catch (error) {
        console.error("Error fetching explanation:", error);
        return `
            <div class='explanation' id="explanation-section">
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
    
    // Create properly styled modal with shell console look
    modalElement.innerHTML = `
        <div class="modal-content">
            <span class="close-btn" onclick="closeModal('${modalId}')">&times;</span>
            <div class="modal-header">
                <div class="modal-title">${fileName.replace('.kql', ' - Detection Query')}</div>
                <div class="modal-actions">
                    <button onclick="copyQueryToClipboard('${modalId}')" class="copy-btn">📋 Copy Query</button>
                    <button onclick="scrollToExplanation('${modalId}')" class="explain-btn">📖 Explain</button>
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
                        <div class="shell-title">${fileName}</div>
                    </div>
                    <div class="shell-content">
                        <pre class="kql-query"><code>${queryContent}</code></pre>
                    </div>
                </div>
                ${explanationContent}
            </div>
        </div>
    `;
}

// Function to scroll to explanation section
function scrollToExplanation(modalId) {
    const modalElement = document.getElementById(modalId);
    const explanationElement = modalElement.querySelector('#explanation-section') || 
                              modalElement.querySelector('.explanation') ||
                              modalElement.querySelector('.query-explanation');
    
    if (explanationElement) {
        explanationElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        console.log("Scrolled to explanation section");
    } else {
        console.log("Explanation section not found. Available elements:", {
            explanationById: !!modalElement.querySelector('#explanation-section'),
            explanationByClass: !!modalElement.querySelector('.explanation'),
            queryExplanation: !!modalElement.querySelector('.query-explanation'),
            allDivs: modalElement.querySelectorAll('div').length
        });
        
        // Fallback: scroll to bottom of modal body
        const modalBody = modalElement.querySelector('.modal-body');
        if (modalBody) {
            modalBody.scrollTop = modalBody.scrollHeight;
            console.log("Scrolled to bottom of modal as fallback");
        }
    }
}

// Function to copy query to clipboard
function copyQueryToClipboard(modalId) {
    const queryContent = window[`${modalId}_content`];
    
    if (!queryContent) {
        console.error('No query content found to copy');
        return;
    }
    
    navigator.clipboard.writeText(queryContent).then(function() {
        const copyBtn = document.querySelector(`#${modalId} .copy-btn`) || document.querySelector('.copy-btn');
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

// Function to initialize detection rules table (works with table.js)
function initializeDetectionTable() {
    console.log('AWS Script: Detection table initialization called');
    // This works with the table.js file which handles the actual rendering
}

// Function to handle severity styling
function applySeverityStyle(element, severity) {
    element.classList.remove('severity-low', 'severity-medium', 'severity-high', 'severity-critical');
    element.classList.add(`severity-${severity}`);
}

// Function to format MITRE ATT&CK techniques for display
function formatMitreTechniques(techniques) {
    if (!techniques || !Array.isArray(techniques)) {
        return 'No techniques specified';
    }
    
    return techniques.map(tech => {
        if (typeof tech === 'string') {
            return tech;
        } else if (tech.tactic && tech.technique) {
            return `${tech.tactic}: ${tech.technique}`;
        }
        return 'Unknown technique';
    }).join('<br>');
}

// Function to handle attack path links
function openAttackPath(url, text) {
    if (url && url.startsWith('http')) {
        window.open(url, '_blank', 'noopener,noreferrer');
    } else {
        console.warn('Invalid attack path URL:', url);
    }
}

// Function to update query count displays
function updateQueryCounts() {
    const countElements = document.querySelectorAll('.query-count');
    countElements.forEach(element => {
        if (element.textContent.includes('Loading')) {
            element.innerHTML = '<span class="count-number">15</span>'; // Default AWS count
        }
    });
}

// Function to handle responsive table adjustments
function handleResponsiveTable() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        if (table.scrollWidth > table.clientWidth) {
            table.classList.add('table-scrollable');
        }
    });
}

// Function to initialize modal click outside to close
function initializeModalClickOutside() {
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// Function to handle keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Escape key to close modals
        if (event.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="display: block"]');
            openModals.forEach(modal => {
                modal.style.display = 'none';
            });
        }
    });
}

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('AWS Script: DOM loaded, initializing...');
    
    // Apply theme if stored in session storage
    const savedTheme = sessionStorage.getItem('att4ckql-theme');
    if (savedTheme === 'attacker') {
        document.body.classList.add('theme-attacker');
    }
    
    // Add event listener for theme toggle if it exists
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            console.log('Theme toggle clicked');
            if (document.body.classList.contains('theme-attacker')) {
                document.body.classList.remove('theme-attacker');
                sessionStorage.setItem('att4ckql-theme', 'defender');
                console.log('Switched to defender theme');
            } else {
                document.body.classList.add('theme-attacker');
                sessionStorage.setItem('att4ckql-theme', 'attacker');
                console.log('Switched to attacker theme');
            }
        });
    }
    
    // Initialize other features
    setTimeout(() => {
        initializeModalClickOutside();
        initializeKeyboardShortcuts();
        handleResponsiveTable();
        updateQueryCounts();
    }, 100);
});

// Export functions for potential use by other scripts
window.awsScript = {
    openModal,
    openExternalModal,
    openQueryModal,
    closeModal,
    copyQueryToClipboard,
    scrollToExplanation,
    getBasePath
};