/*!
 * ATT4CKQL Core JavaScript v2.5 - FIXED VERSION
 * Enhanced KQL Queries for Microsoft Sentinel  
 * Handles: Theme Management, Query Counts, Modal Management, Query Processing
 * Table management handled separately by table.js/platform-tables.js
 * FIXES: Font loading, Sample logs content, Scroll bars, Complete content processing
 * Created: 2025
 */

// =====================================
// HELPER FUNCTIONS (from aws-script.js)
// =====================================

// Helper function to get the correct path with baseurl
function getBasePath(path) {
    const baseUrl = window.siteBaseUrl || '';
    return baseUrl + path;
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

// =====================================
// THEME MANAGEMENT (from main.js)
// =====================================

function setTheme(theme) {
    if (theme === 'attacker') {
        document.body.classList.add('theme-attacker');
        sessionStorage.setItem('att4ckql-theme', 'attacker');
    } else {
        document.body.classList.remove('theme-attacker');
        sessionStorage.setItem('att4ckql-theme', 'defender');
    }
    console.log(`Theme set to: ${theme}`);
}

// Global function for theme chooser (called from HTML)
function showMain(theme) {
    setTheme(theme);
    const themeChooser = document.getElementById('theme-chooser');
    const mainContent = document.getElementById('main-content');
    
    if (themeChooser) themeChooser.style.display = 'none';
    if (mainContent) {
        mainContent.style.display = 'block';
        mainContent.style.opacity = '1';
        mainContent.classList.add('visible');
    }
}

// =====================================
// QUERY COUNT MANAGEMENT (from main.js)
// =====================================

// Set fixed counts (can be updated with Jekyll later)
const counts = {
    'active-directory': 42,
    'aws': 15, // Updated to reflect your actual AWS detection rules
    'gcp': 28,
    'azure': 47,
    'entraid': 39,
    'office365': 31,
    'defender': 38
};

// Function to count KQL files dynamically from GitHub repository
function countKQLFiles() {
    const repoOwner = "realnamesareboring";
    const repoName = "jekyllatt4ckql";
    const apiBaseUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/`;
    
    // Define the folders to check
    const folders = {
        'active-directory': ['Active Directory/Queries'],
        'aws': ['Amazon Web Services/Queries'],
        'gcp': ['Google Cloud Platform/Queries'],
        'azure': ['Azure/Queries'],
        'entraid': ['Entra ID/Queries'],
        'office365': ['Office 365/Queries'],
        'defender': ['Microsoft Defender/Queries']
    };

    let completedRequests = 0;
    const totalRequests = Object.keys(folders).length;

    Object.entries(folders).forEach(([platform, paths]) => {
        let totalCount = 0;
        let completedPaths = 0;

        paths.forEach(path => {
            fetch(`${apiBaseUrl}${encodeURIComponent(path)}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const kqlFiles = data.filter(file => 
                        file.name.toLowerCase().endsWith('.kql') && file.type === 'file'
                    );
                    totalCount += kqlFiles.length;
                })
                .catch(error => {
                    console.warn(`Failed to count files for ${platform}/${path}: ${error.message}`);
                    // Use fallback count
                    totalCount += counts[platform] || 0;
                })
                .finally(() => {
                    completedPaths++;
                    if (completedPaths === paths.length) {
                        if (totalCount > 0) {
                            counts[platform] = totalCount;
                        }
                        completedRequests++;
                        if (completedRequests === totalRequests) {
                            updateCounts();
                        }
                    }
                });
        });
    });
}

// Function to update counts in the table - use hardcoded counts as fallback
function updateCounts() {
    const sourceLinks = document.querySelectorAll('.source-link[data-source]');
    let totalCount = 0;
    
    sourceLinks.forEach(link => {
        const sourceId = link.getAttribute('data-source');
        const countCell = link.closest('tr').querySelector('.query-count');
        
        if (countCell) {
            // Set the count directly from our fixed values
            const count = counts[sourceId] || 0;
            countCell.textContent = count;
            totalCount += count;
            
            // Add highlight effect
            countCell.classList.add('updated');
            setTimeout(() => {
                countCell.classList.remove('updated');
            }, 2000);
        }
    });
    
    // Update the results count in header
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = `${Object.keys(counts).length} sources (${totalCount} total queries)`;
    }
    
    console.log(`Updated query counts: ${totalCount} total across ${Object.keys(counts).length} sources`);
}

// Function to initialize the page with dynamic KQL counts or fallback to static counts
function initializeWithCounts() {
    // Try dynamic counting first, fall back to static if it fails
    try {
        countKQLFiles();
    } catch (error) {
        console.error("Error counting KQL files dynamically:", error);
        // Fall back to static counts if dynamic counting fails
        updateCounts();
    }
}

// =====================================
// MODAL MANAGEMENT (COMPLETE from aws-script.js)
// =====================================

// Function to load modal content from Jekyll-served files (COMPLETE ORIGINAL LOGIC)
async function loadExternalModalContent(modalId, modalType) {
    const modalElement = document.getElementById(modalId);
    
    if (!modalElement) {
        console.error(`Modal element with ID ${modalId} not found.`);
        return;
    }
    
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
        
        // Process the content to ensure proper modal structure (COMPLETE ORIGINAL LOGIC)
        let processedContent = modalContent;
        
        // Remove Jekyll front matter if present
        processedContent = processedContent.replace(/^---[\s\S]*?---\s*/m, '');
        
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
        
        // Add table wrapper for better scrolling if log tables are present (CRITICAL FIX)
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

// Function to fetch explanation content from local Jekyll files
async function fetchExplanationContent(modalId) {
    try {
        let explanationId = modalId;
        console.log("Original modalId:", modalId);
        
        // If modalId starts with 'aws-', remove it
        if (modalId.startsWith('aws-')) {
            explanationId = modalId.substring(4);
            console.log("After removing 'aws-' prefix:", explanationId);
        }
        
        // If explanationId ends with '-kql', remove it
        if (explanationId.endsWith('-kql')) {
            explanationId = explanationId.substring(0, explanationId.length - 4);
            console.log("After removing '-kql' suffix:", explanationId);
        }
        
        const explanationPath = getBasePath(`/Amazon Web Services/explained/${explanationId}-kqlexplained.html`);
        console.log(`Fetching explanation from local Jekyll: ${explanationPath}`);
        
        const response = await fetch(explanationPath);
        
        if (!response.ok) {
            console.error(`Failed to fetch explanation from local Jekyll. Status: ${response.status}`);
            return '<div id="explanation-section"><h3>Explanation</h3><p>Explanation content not available.</p></div>';
        }
        
        const content = await response.text();
        console.log(`Explanation content loaded successfully from Jekyll`);
        return `<div id="explanation-section" class="query-explanation">${content}</div>`;
    } catch (error) {
        console.error('Error fetching explanation:', error);
        return '<div id="explanation-section"><h3>Explanation</h3><p>Failed to load explanation.</p></div>';
    }
}

// Function to process and display query content with explanation (COMPLETE ORIGINAL)
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
                        <pre class="kql-query"><code>${escapeHtml(queryContent)}</code></pre>
                    </div>
                </div>
                ${explanationContent}
            </div>
        </div>
    `;
}

// Function to fetch KQL query from Jekyll-served files (COMPLETE ORIGINAL)
async function fetchQueryWithShellDisplay(modalId, githubPath) {
    const modalElement = document.getElementById(modalId);
    const fileName = githubPath.split('/').pop(); // Extract just the filename
    
    try {
        // Use local Jekyll path with baseurl
        const queryPath = getBasePath(`/Amazon Web Services/Queries/${fileName}`);
        
        console.log(`Fetching KQL query from local Jekyll: ${queryPath}`);
        
        const response = await fetch(queryPath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
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

// =====================================
// QUERY MODAL FUNCTIONS (COMPLETE ORIGINAL)
// =====================================

// Function to copy query to clipboard
function copyQueryToClipboard(modalId) {
    const content = window[`${modalId}_content`];
    if (!content) {
        console.error('No content found for copying');
        alert('No content to copy');
        return;
    }
    
    navigator.clipboard.writeText(content).then(function() {
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
            queryExplanation: !!modalElement.querySelector('.query-explanation')
        });
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

// =====================================
// INITIALIZATION (combined from both files)
// =====================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('ATT4CKQL Core: Initializing...');
    
    // =====================================
    // THEME MANAGEMENT INITIALIZATION (from main.js)
    // =====================================
    
    // Get DOM elements with null checks
    const themeChooser = document.getElementById('theme-chooser');
    const mainContent = document.getElementById('main-content');
    const defenderButton = document.querySelector('.defender-button');
    const attackerButton = document.querySelector('.attacker-button');
    const themeToggle = document.getElementById('theme-toggle');

    // Event listeners with null checks
    if (defenderButton) {
        defenderButton.addEventListener('click', function() {
            setTheme('defender');
            if (themeChooser) themeChooser.style.display = 'none';
            if (mainContent) {
                mainContent.style.opacity = '1';
                mainContent.classList.add('visible');
            }
        });
    }

    if (attackerButton) {
        attackerButton.addEventListener('click', function() {
            setTheme('attacker');
            if (themeChooser) themeChooser.style.display = 'none';
            if (mainContent) {
                mainContent.style.opacity = '1';
                mainContent.classList.add('visible');
            }
        });
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            // Toggle between themes
            const isAttacker = document.body.classList.contains('theme-attacker');
            setTheme(isAttacker ? 'defender' : 'attacker');
        });
    }

    // Check for saved theme preference and apply it immediately (CRITICAL FIX)
    const savedTheme = sessionStorage.getItem('att4ckql-theme');
    if (savedTheme) {
        setTheme(savedTheme);
        console.log(`Applied saved theme: ${savedTheme}`);
    }

    // =====================================
    // PAGE-SPECIFIC INITIALIZATION
    // =====================================
    
    // Initialize counts on main page (if source-link elements exist)
    if (document.querySelector('.source-link')) {
        console.log('Main page detected - initializing query counts...');
        initializeWithCounts();
    }
    
    // Initialize other features with small delay
    setTimeout(() => {
        // Initialize keyboard shortcuts for modals
        document.addEventListener('keydown', function(event) {
            // Escape key to close modals
            if (event.key === 'Escape') {
                const openModals = document.querySelectorAll('.modal[style*="display: block"]');
                openModals.forEach(modal => {
                    modal.style.display = 'none';
                });
            }
        });
        
        // Initialize modal click outside to close
        document.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        });
        
        // Initialize responsive table handling
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            if (table.scrollWidth > table.clientWidth) {
                table.classList.add('table-scrollable');
            }
        });
        
        console.log('ATT4CKQL Core: Initialization complete');
    }, 100);
});