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

/* ========================================
   CYBERPUNK THEME FIXES v1.1
   REPLACE THE PREVIOUS CYBERPUNK JS PATCH WITH THIS UPDATED VERSION
   
   FIXES:
   - Theme switching stuck issue (proper cycling)
   - Floating KQL effects not working
   - Better integration with existing theme system
   - Enhanced initialization
   ======================================== */

// =====================================
// CYBERPUNK THEME INTEGRATION - FIXED
// =====================================

// Global cyberpunk state tracking
let cyberpunkActive = false;
let floatingKQLInterval = null;
let cyberpunkInitialized = false;

// =====================================
// FIX 1: PROPER THEME SWITCHING
// =====================================

// Enhanced theme management that properly handles all 3 themes
function enhancedSetTheme(theme) {
    console.log(`Setting theme to: ${theme}`);
    
    // Clear all theme classes first
    document.body.classList.remove('theme-attacker', 'theme-cyberpunk');
    
    // Stop floating effects for all theme changes
    stopFloatingKQL();
    cyberpunkActive = false;
    
    // Apply the selected theme
    if (theme === 'attacker') {
        document.body.classList.add('theme-attacker');
        sessionStorage.setItem('att4ckql-theme', 'attacker');
    } else if (theme === 'cyberpunk') {
        document.body.classList.add('theme-cyberpunk');
        sessionStorage.setItem('att4ckql-theme', 'cyberpunk');
        cyberpunkActive = true;
        // Start floating effects after a short delay
        setTimeout(() => {
            if (cyberpunkActive) {
                startFloatingKQL();
            }
        }, 1000);
    } else {
        // Default to defender
        sessionStorage.setItem('att4ckql-theme', 'defender');
    }
    
    // Update theme toggle icon
    updateCyberpunkThemeToggle(theme);
    
    console.log(`Theme successfully set to: ${theme}, cyberpunkActive: ${cyberpunkActive}`);
}

// Override the global setTheme function
if (typeof window.setTheme === 'function') {
    const originalSetTheme = window.setTheme;
    window.setTheme = function(theme) {
        enhancedSetTheme(theme);
    };
} else {
    window.setTheme = enhancedSetTheme;
}

// Helper function to determine current theme
function getCurrentTheme() {
    if (document.body.classList.contains('theme-cyberpunk')) {
        return 'cyberpunk';
    } else if (document.body.classList.contains('theme-attacker')) {
        return 'attacker';
    } else {
        return 'defender';
    }
}

// =====================================
// FIX 2: PROPER THEME CYCLING
// =====================================

// Enhanced theme cycling that properly cycles through all 3 themes
function cycleThemes() {
    const currentTheme = getCurrentTheme();
    let nextTheme;
    
    console.log(`Current theme: ${currentTheme}`);
    
    if (currentTheme === 'defender') {
        nextTheme = 'attacker';
    } else if (currentTheme === 'attacker') {
        nextTheme = 'cyberpunk';
    } else if (currentTheme === 'cyberpunk') {
        nextTheme = 'defender';
    } else {
        // Fallback
        nextTheme = 'defender';
    }
    
    console.log(`Cycling to: ${nextTheme}`);
    enhancedSetTheme(nextTheme);
}

// Update theme toggle icon for 3 themes
function updateCyberpunkThemeToggle(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icons = {
            'defender': '🛡️',
            'attacker': '⚔️',
            'cyberpunk': '🌈'
        };
        themeToggle.textContent = icons[theme] || '🌙';
        themeToggle.title = `Current: ${theme.charAt(0).toUpperCase() + theme.slice(1)} - Click to cycle themes`;
    }
}

// Enhanced theme toggle setup
function setupCyberpunkThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Remove existing event listeners by cloning
        const newThemeToggle = themeToggle.cloneNode(true);
        themeToggle.parentNode.replaceChild(newThemeToggle, themeToggle);
        
        // Add new 3-theme cycling event listener
        newThemeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            cycleThemes();
        });
        
        console.log('Cyberpunk theme toggle enhanced');
    }
}

/* ========================================
   WORKING DRIFT ANIMATION FIX v1.4
   REPLACE THE createFloatingKQL FUNCTION IN YOUR CYBERPUNK JS PATCH
   
   FIXES:
   - Elements actually MOVE instead of being sticky notes
   - Proper animation sequencing  
   - Guaranteed visibility during drift
   ======================================== */

// Create floating KQL that ACTUALLY DRIFTS with proper animation
function createFloatingKQL() {
    if (!cyberpunkActive || !document.body.classList.contains('theme-cyberpunk')) {
        return;
    }
    
    const kqlSnippets = [
        'AWSCloudTrail | where TimeGenerated > ago(1h)',
        'SecurityEvent | where EventID == 4625', 
        'SigninLogs | where ResultType != 0',
        'DeviceProcessEvents | project TimeGenerated, DeviceName',
        'OfficeActivity | where Operation == "FileDownloaded"',
        'AzureActivity | where OperationName contains "delete"',
        'SecurityAlert | where AlertSeverity == "High"',
        'let timeframe = 24h; union SecurityEvent',
        'summarize count() by bin(TimeGenerated, 1h)',
        'where isnotempty(SourceIP)',
        'extend AccountDomain = split(Account, "\\\\")',
        'order by TimeGenerated desc | take 100',
        'join kind=inner on Computer',
        'render timechart',
        'parse EventData with * "ProcessName=" ProcessName'
    ];
    
    const element = document.createElement('div');
    element.className = 'floating-kql';
    
    // Random snippet
    const snippet = kqlSnippets[Math.floor(Math.random() * kqlSnippets.length)];
    element.textContent = snippet;
    
    // Random color class for variety
    const colors = ['', 'neon-pink', 'neon-yellow', 'neon-green'];
    const colorClass = colors[Math.floor(Math.random() * colors.length)];
    if (colorClass) {
        element.classList.add(colorClass);
    }
    
    // Get viewport dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Choose random direction for drift
    const direction = Math.floor(Math.random() * 4);
    let startX, startY, endX, endY;
    
    switch(direction) {
        case 0: // Left to Right drift
            startX = -400;
            startY = Math.random() * (windowHeight - 100) + 50;
            endX = windowWidth + 100;
            endY = startY + (Math.random() * 100 - 50);
            break;
        case 1: // Right to Left drift  
            startX = windowWidth + 100;
            startY = Math.random() * (windowHeight - 100) + 50;
            endX = -400;
            endY = startY + (Math.random() * 100 - 50);
            break;
        case 2: // Top to Bottom drift
            startX = Math.random() * (windowWidth - 300) + 150;
            startY = -50;
            endX = startX + (Math.random() * 200 - 100);
            endY = windowHeight + 50;
            break;
        case 3: // Bottom to Top drift
            startX = Math.random() * (windowWidth - 300) + 150;
            startY = windowHeight + 50;
            endX = startX + (Math.random() * 200 - 100);
            endY = -50;
            break;
    }
    
    // CRITICAL: Set initial position and styling
    element.style.position = 'fixed';
    element.style.left = startX + 'px';
    element.style.top = startY + 'px';
    element.style.zIndex = '9999';
    element.style.pointerEvents = 'none';
    element.style.opacity = '0'; // Start invisible
    
    // Add to body FIRST
    document.body.appendChild(element);
    
    console.log(`Creating drifting KQL: ${snippet.substring(0, 30)}... from (${startX}, ${startY}) to (${endX}, ${endY})`);
    
    // STEP 1: Fade in (make visible)
    setTimeout(() => {
        if (element.parentNode && cyberpunkActive) {
            element.style.transition = 'opacity 2s ease-in';
            element.style.opacity = '0.8'; // Make visible and translucent
            
            console.log('KQL element faded in and visible');
            
            // STEP 2: Start movement after fade in completes
            setTimeout(() => {
                if (element.parentNode && cyberpunkActive) {
                    console.log(`Starting movement from (${startX}, ${startY}) to (${endX}, ${endY})`);
                    
                    // Set movement transition and move to end position
                    element.style.transition = 'left 25s linear, top 25s linear';
                    element.style.left = endX + 'px';
                    element.style.top = endY + 'px';
                    
                    console.log('Movement transition applied');
                    
                    // STEP 3: Start fading out after 2/3 of journey
                    setTimeout(() => {
                        if (element.parentNode) {
                            element.style.transition = 'left 25s linear, top 25s linear, opacity 6s ease-out';
                            element.style.opacity = '0';
                            console.log('KQL element starting fade out');
                        }
                    }, 17000); // Start fade out after 17 seconds
                }
            }, 2500); // Start movement after fade in completes
        }
    }, 300);
    
    // STEP 4: Remove element after complete journey
    setTimeout(() => {
        if (element.parentNode) {
            try {
                element.parentNode.removeChild(element);
                console.log('KQL element removed after journey complete');
            } catch (e) {
                console.log('Element already removed');
            }
        }
    }, 30000); // Remove after 30 seconds total
}

/* ========================================
   ALSO UPDATE THE CSS - SIMPLIFIED VERSION
   Replace the .floating-kql CSS with this:
   ======================================== */
// Start floating KQL with proper intervals
function startFloatingKQL() {
    if (floatingKQLInterval || !cyberpunkActive) {
        return;
    }
    
    console.log('Starting properly drifting cyberpunk KQL effects');
    
    // Create initial elements with staggered timing
    setTimeout(() => createFloatingKQL(), 2000);
    setTimeout(() => createFloatingKQL(), 6000);
    setTimeout(() => createFloatingKQL(), 12000);
    
    // Set up regular interval for continuous drift
    floatingKQLInterval = setInterval(() => {
        if (cyberpunkActive && document.body.classList.contains('theme-cyberpunk')) {
            // Create new drifting element
            if (Math.random() < 0.6) {
                createFloatingKQL();
            }
        } else {
            // Stop if theme changed
            stopFloatingKQL();
        }
    }, 8000); // Every 8 seconds
}

// Enhanced stop function
function stopFloatingKQL() {
    if (floatingKQLInterval) {
        clearInterval(floatingKQLInterval);
        floatingKQLInterval = null;
        console.log('Stopped drifting KQL effects');
    }
    
    // Remove all existing floating elements
    const existingElements = document.querySelectorAll('.floating-kql');
    existingElements.forEach(el => {
        try {
            if (el.parentNode) {
                // Fade out existing elements
                el.style.transition = 'opacity 1s ease-out';
                el.style.opacity = '0';
                setTimeout(() => {
                    if (el.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                }, 1000);
            }
        } catch (e) {
            console.log('Error removing floating element:', e);
        }
    });
}

/* ========================================
   INSTALLATION:
   
   REPLACE these three functions in your cyberpunk JS patch:
   1. createFloatingKQL()
   2. startFloatingKQL() 
   3. stopFloatingKQL()
   
   ALSO UPDATE THE CSS (see next artifact)
   
   RESULT: 
   ✅ KQL queries actually DRIFT across screen
   ✅ Translucent appearance (opacity: 0.7)
   ✅ Smooth movement from edge to edge
   ✅ Fade in at start, fade out at end
   ✅ No more stuck/static queries!
   ======================================== */

// =====================================
// FIX 4: ENHANCED SHOWMAIN FUNCTION
// =====================================

// Enhanced showMain function for theme chooser
function enhancedShowMain(theme) {
    console.log(`ShowMain called with theme: ${theme}`);
    
    enhancedSetTheme(theme);
    
    const themeChooser = document.getElementById('theme-chooser');
    const mainContent = document.getElementById('main-content');
    
    if (themeChooser) {
        themeChooser.style.display = 'none';
    }
    if (mainContent) {
        mainContent.style.display = 'block';
        mainContent.style.opacity = '1';
        mainContent.classList.add('visible');
    }
    
    console.log(`Main content shown with theme: ${theme}`);
}

// Override global showMain
window.showMain = enhancedShowMain;

// =====================================
// CYBERPUNK EVENT HANDLERS
// =====================================

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopFloatingKQL();
    } else if (cyberpunkActive) {
        setTimeout(() => {
            if (cyberpunkActive) {
                startFloatingKQL();
            }
        }, 1000);
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    if (cyberpunkActive) {
        // Restart floating effects with new dimensions
        stopFloatingKQL();
        setTimeout(() => {
            if (cyberpunkActive) {
                startFloatingKQL();
            }
        }, 500);
    }
});

// =====================================
// CYBERPUNK INITIALIZATION
// =====================================

function initializeCyberpunkIntegration() {
    if (cyberpunkInitialized) {
        return;
    }
    
    console.log('ATT4CKQL Cyberpunk Integration: Initializing...');
    
    // Check for saved cyberpunk theme
    const savedTheme = sessionStorage.getItem('att4ckql-theme');
    console.log(`Saved theme: ${savedTheme}`);
    
    if (savedTheme === 'cyberpunk') {
        enhancedSetTheme('cyberpunk');
        console.log('Applied saved cyberpunk theme');
    } else if (savedTheme === 'attacker') {
        enhancedSetTheme('attacker');
        console.log('Applied saved attacker theme');
    } else {
        enhancedSetTheme('defender');
        console.log('Applied default defender theme');
    }
    
    // Setup enhanced theme toggle
    setupCyberpunkThemeToggle();
    
    // Add cyberpunk button event listener
    setTimeout(() => {
        const cyberpunkButton = document.querySelector('.cyberpunk-button');
        if (cyberpunkButton) {
            cyberpunkButton.addEventListener('click', function() {
                console.log('Cyberpunk button clicked');
                enhancedShowMain('cyberpunk');
            });
            console.log('Cyberpunk button event listener added');
        }
    }, 100);
    
    cyberpunkInitialized = true;
    console.log('ATT4CKQL Cyberpunk Integration: Complete');
}

// =====================================
// FONT LOADING
// =====================================

function loadCyberpunkFonts() {
    if (!document.querySelector('link[href*="Orbitron"]')) {
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
        console.log('Cyberpunk fonts loaded');
    }
}

// =====================================
// INITIALIZATION SEQUENCE
// =====================================

// Primary initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing cyberpunk integration...');
    
    // Load fonts if cyberpunk theme is saved
    const savedTheme = sessionStorage.getItem('att4ckql-theme');
    if (savedTheme === 'cyberpunk') {
        loadCyberpunkFonts();
    }
    
    // Initialize with delay to ensure other scripts load first
    setTimeout(initializeCyberpunkIntegration, 300);
});

// Backup initialization in case DOMContentLoaded already fired
if (document.readyState === 'loading') {
    // DOM is still loading
    document.addEventListener('DOMContentLoaded', initializeCyberpunkIntegration);
} else {
    // DOM already loaded
    setTimeout(initializeCyberpunkIntegration, 100);
}

// =====================================
// GLOBAL EXPOSURE
// =====================================

// Make cyberpunk functions available globally for debugging
window.cyberpunkTheme = {
    setTheme: enhancedSetTheme,
    getCurrentTheme: getCurrentTheme,
    cycleThemes: cycleThemes,
    startFloatingKQL: startFloatingKQL,
    stopFloatingKQL: stopFloatingKQL,
    loadFonts: loadCyberpunkFonts,
    active: () => cyberpunkActive,
    initialized: () => cyberpunkInitialized
};

console.log('ATT4CKQL Cyberpunk Integration Fixes v1.1 Loaded Successfully');

/* ========================================
   END CYBERPUNK FIXES v1.1
   
   These fixes address:
   ✅ Theme switching stuck issue (proper cycling logic)
   ✅ Floating KQL effects not working (enhanced creation)
   ✅ Better initialization sequence
   ✅ Enhanced debugging and state tracking
   ======================================== */
   // ========================================
// GLITCH EFFECT PATCH v1.0
// ADD THIS TO THE END OF YOUR att4ckql-core.js FILE
// ========================================

/**
 * Apply glitch effects when cyberpunk theme is active
 */
function applyGlitchEffects() {
    console.log('Applying glitch effects...');
    
    // Only apply if cyberpunk theme is active
    if (!document.body.classList.contains('theme-cyberpunk')) {
        console.log('Not cyberpunk theme, skipping glitch effects');
        return;
    }
    
    const title = document.querySelector('h1');
    const subtitle = document.querySelector('.subtitle');
    
    if (title) {
        // Add glitch class immediately
        title.classList.add('glitch');
        console.log('✅ Glitch class added to title');
        
        // Restart glitch animation periodically to keep it fresh
        const glitchInterval = setInterval(() => {
            if (document.body.classList.contains('theme-cyberpunk')) {
                title.classList.remove('glitch');
                setTimeout(() => {
                    title.classList.add('glitch');
                    console.log('🔄 Glitch animation restarted');
                }, 100);
            } else {
                // Clean up interval if theme changes
                clearInterval(glitchInterval);
            }
        }, 8000); // Restart every 8 seconds
    } else {
        console.log('❌ No h1 element found for glitch effect');
    }
    
    if (subtitle) {
        // Add occasional glitch to subtitle
        setTimeout(() => {
            const subtitleInterval = setInterval(() => {
                if (document.body.classList.contains('theme-cyberpunk')) {
                    subtitle.classList.add('glitch');
                    setTimeout(() => subtitle.classList.remove('glitch'), 2000);
                    console.log('🌟 Subtitle glitch triggered');
                } else {
                    clearInterval(subtitleInterval);
                }
            }, 12000); // Glitch every 12 seconds
        }, 4000);
    }
}

/**
 * Manual glitch trigger function
 */
function triggerManualGlitch() {
    console.log('🎯 Manual glitch triggered');
    
    const title = document.querySelector('h1');
    const subtitle = document.querySelector('.subtitle');
    const links = document.querySelectorAll('.source-link');
    
    [title, subtitle, ...links].forEach(el => {
        if (el) {
            el.classList.add('glitch');
            setTimeout(() => el.classList.remove('glitch'), 2000);
        }
    });
}

/**
 * Enhanced theme switching with glitch integration
 */
function switchToCyberpunkTheme() {
    console.log('🌈 Switching to cyberpunk theme with glitch effects');
    
    // Apply cyberpunk theme class
    document.body.classList.remove('theme-attacker');
    document.body.classList.add('theme-cyberpunk');
    
    // Wait a moment for CSS to load, then apply glitch effects
    setTimeout(() => {
        applyGlitchEffects();
    }, 500);
}

// ========================================
// INTEGRATION WITH EXISTING CODE
// ========================================

// Add glitch keyboard shortcut
document.addEventListener('keydown', function(event) {
    // Manual glitch trigger (Ctrl+G)
    if (event.code === 'KeyG' && event.ctrlKey) {
        event.preventDefault();
        triggerManualGlitch();
    }
});

// Auto-apply glitch effects when page loads with cyberpunk theme
document.addEventListener('DOMContentLoaded', function() {
    // Check if cyberpunk theme is already active on page load
    setTimeout(() => {
        if (document.body.classList.contains('theme-cyberpunk')) {
            console.log('🔍 Cyberpunk theme detected on page load');
            applyGlitchEffects();
        }
    }, 1000);
});

// ========================================
// HOOK INTO YOUR EXISTING THEME SYSTEM
// ========================================

// If you have existing theme functions, modify them like this:
// FIND your existing cyberpunk theme activation code and ADD this line:

/*
// Example of how to modify your existing theme switching:
if (theme === 'cyberpunk') {
    document.body.classList.add('theme-cyberpunk');
    
    // ADD THIS LINE to your existing cyberpunk theme code:
    setTimeout(() => applyGlitchEffects(), 500);
}
*/

// ========================================
// DEBUGGING AND TESTING
// ========================================

// Make functions available globally for testing
window.glitchDebug = {
    apply: applyGlitchEffects,
    trigger: triggerManualGlitch,
    test: function() {
        console.log('🧪 Testing glitch system...');
        const h1 = document.querySelector('h1');
        if (h1) {
            h1.classList.add('glitch');
            console.log('✅ Glitch class added for testing');
            setTimeout(() => {
                h1.classList.remove('glitch');
                console.log('✅ Glitch class removed after test');
            }, 3000);
        } else {
            console.log('❌ No h1 element found for testing');
        }
    },
    forceActivate: function() {
        document.body.classList.add('theme-cyberpunk');
        setTimeout(() => applyGlitchEffects(), 100);
        console.log('🚀 Forced cyberpunk theme and glitch activation');
    }
};

console.log('🎉 Glitch system loaded! Test with:');
console.log('• Press Ctrl+G for manual glitch');
console.log('• glitchDebug.test() - Test glitch effect');
console.log('• glitchDebug.forceActivate() - Force activate cyberpunk + glitch');

// ========================================
// END OF GLITCH PATCH
// ========================================
/* ========================================
   ULTIMATE CYBERPUNK JAVASCRIPT INTEGRATION
   REPLACE YOUR applyGlitchEffects FUNCTION IN att4ckql-core.js
   ======================================== */

/**
 * Ultimate cyberpunk glitch effects with RGB separation + typing animation
 * UPDATED VERSION - Complete integration
 */
function applyGlitchEffects() {
    console.log('🌈 Applying ultimate cyberpunk effects (RGB glitch + typing)...');
    
    // Only apply if cyberpunk theme is active
    if (!document.body.classList.contains('theme-cyberpunk')) {
        console.log('❌ Not cyberpunk theme, skipping glitch effects');
        return;
    }
    
    const title = document.querySelector('h1');
    const subtitle = document.querySelector('.subtitle');
    
    // ===== TITLE RGB GLITCH EFFECT =====
    if (title) {
        // Add data-text attribute for pseudo-elements
        title.setAttribute('data-text', title.textContent);
        
        // Add glitch class for RGB separation effect
        title.classList.add('glitch');
        console.log('✅ RGB glitch effect added to title');
        
        // Clear any existing interval to prevent duplicates
        if (typeof glitchMainInterval !== 'undefined' && glitchMainInterval) {
            clearInterval(glitchMainInterval);
        }
        
        // Restart glitch animation periodically to keep it dynamic
        glitchMainInterval = setInterval(() => {
            if (document.body.classList.contains('theme-cyberpunk')) {
                // Brief pause to reset animation
                title.classList.remove('glitch');
                setTimeout(() => {
                    title.classList.add('glitch');
                    console.log('🔄 RGB glitch animation refreshed');
                }, 100);
            } else {
                // Clean up interval if theme changes
                clearInterval(glitchMainInterval);
                glitchMainInterval = null;
                console.log('🛑 Glitch interval cleared (theme changed)');
            }
        }, 8000); // Restart glitch every 8 seconds
        
    } else {
        console.log('❌ No h1 element found for glitch effect');
    }
    
    // ===== SUBTITLE TYPING + GLITCH EFFECT =====
    if (subtitle) {
        // Add data-text attribute for pseudo-elements
        subtitle.setAttribute('data-text', subtitle.textContent);
        
        // Add typing effect immediately
        subtitle.classList.add('terminal-typing');
        console.log('✅ Typing effect added to subtitle');
        
        // Clear any existing subtitle interval
        if (typeof glitchSubtitleInterval !== 'undefined' && glitchSubtitleInterval) {
            clearInterval(glitchSubtitleInterval);
        }
        
        // Add occasional glitch effect to subtitle (after typing finishes)
        setTimeout(() => {
            glitchSubtitleInterval = setInterval(() => {
                if (document.body.classList.contains('theme-cyberpunk')) {
                    // Add glitch effect briefly
                    subtitle.classList.add('glitch');
                    setTimeout(() => {
                        subtitle.classList.remove('glitch');
                    }, 2000);
                    console.log('🌟 Subtitle glitch burst triggered');
                } else {
                    clearInterval(glitchSubtitleInterval);
                    glitchSubtitleInterval = null;
                }
            }, 18000); // Glitch subtitle every 18 seconds
        }, 8000); // Start after typing animation completes (4s) + delay (4s)
    }
    
    console.log('🚀 Ultimate cyberpunk effects fully activated!');
}

/* ========================================
   UPDATED MANUAL GLITCH FUNCTION
   ======================================== */

/**
 * Manual glitch trigger with typing restart
 * UPDATED VERSION - Includes typing effect restart
 */
function triggerManualGlitch() {
    console.log('🎯 Ultimate manual glitch burst triggered!');
    
    const title = document.querySelector('h1');
    const subtitle = document.querySelector('.subtitle');
    const headers = document.querySelectorAll('h2, h3');
    
    // Apply RGB glitch to multiple elements
    [title, subtitle, ...headers].forEach((el, index) => {
        if (el) {
            // Add data-text attribute if missing
            if (!el.hasAttribute('data-text')) {
                el.setAttribute('data-text', el.textContent);
            }
            
            // Stagger the glitch effects for a cascading look
            setTimeout(() => {
                el.classList.add('glitch');
                setTimeout(() => {
                    el.classList.remove('glitch');
                }, 2000);
            }, index * 200); // 200ms delay between each element
        }
    });
    
    // Restart typing animation on subtitle
    if (subtitle && document.body.classList.contains('theme-cyberpunk')) {
        setTimeout(() => {
            subtitle.classList.remove('terminal-typing');
            setTimeout(() => {
                subtitle.classList.add('terminal-typing');
                console.log('🖥️ Typing animation restarted');
            }, 100);
        }, 1000); // Restart after 1 second
    }
}

/* ========================================
   ENHANCED THEME DEACTIVATION
   ======================================== */

/**
 * Clean up all cyberpunk effects when switching themes
 */
function deactivateAllCyberpunkEffects() {
    console.log('🛑 Deactivating all cyberpunk effects...');
    
    // Clear intervals
    if (typeof glitchMainInterval !== 'undefined' && glitchMainInterval) {
        clearInterval(glitchMainInterval);
        glitchMainInterval = null;
    }
    if (typeof glitchSubtitleInterval !== 'undefined' && glitchSubtitleInterval) {
        clearInterval(glitchSubtitleInterval);
        glitchSubtitleInterval = null;
    }
    
    // Remove all glitch and typing classes
    const allElements = document.querySelectorAll('.glitch, .terminal-typing');
    allElements.forEach(el => {
        el.classList.remove('glitch', 'terminal-typing');
    });
    
    console.log('✅ All cyberpunk effects cleaned up');
}

/* ========================================
   HOOK INTO EXISTING THEME SYSTEM
   Add this to your theme switching code:
   
   When switching TO cyberpunk:
   setTimeout(() => applyGlitchEffects(), 500);
   
   When switching FROM cyberpunk:
   deactivateAllCyberpunkEffects();
   ======================================== */

/* ========================================
   GLOBAL DEBUG INTERFACE - ENHANCED
   ======================================== */

// Enhanced global debugging
window.ultimateCyberpunk = {
    activate: applyGlitchEffects,
    deactivate: deactivateAllCyberpunkEffects,
    manualGlitch: triggerManualGlitch,
    
    restartTyping: function() {
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
            subtitle.classList.remove('terminal-typing');
            setTimeout(() => subtitle.classList.add('terminal-typing'), 100);
            console.log('🖥️ Typing animation manually restarted');
        }
    },
    
    testAll: function() {
        console.log('🧪 Testing all ultimate cyberpunk effects...');
        document.body.classList.add('theme-cyberpunk');
        setTimeout(() => applyGlitchEffects(), 100);
        console.log('✅ Ultimate cyberpunk test activated');
    },
    
    status: function() {
        console.log('📊 Ultimate Cyberpunk Status:');
        console.log('- Cyberpunk theme active:', document.body.classList.contains('theme-cyberpunk'));
        console.log('- RGB glitch interval:', glitchMainInterval ? 'RUNNING' : 'STOPPED');
        console.log('- Subtitle interval:', glitchSubtitleInterval ? 'RUNNING' : 'STOPPED');
        console.log('- Elements with glitch class:', document.querySelectorAll('.glitch').length);
        console.log('- Elements with typing class:', document.querySelectorAll('.terminal-typing').length);
        
        const title = document.querySelector('h1');
        const subtitle = document.querySelector('.subtitle');
        if (title) {
            console.log('- Title has data-text:', title.hasAttribute('data-text'));
            console.log('- Title has glitch class:', title.classList.contains('glitch'));
        }
        if (subtitle) {
            console.log('- Subtitle has data-text:', subtitle.hasAttribute('data-text'));
            console.log('- Subtitle has typing class:', subtitle.classList.contains('terminal-typing'));
        }
    }
};

console.log('🎉 Ultimate Cyberpunk System loaded!');
console.log('💡 Test commands:');
console.log('  • ultimateCyberpunk.testAll() - Test everything');
console.log('  • ultimateCyberpunk.status() - Check status');
console.log('  • ultimateCyberpunk.restartTyping() - Restart typing');
console.log('  • Ctrl+G - Manual glitch burst');

/* ========================================
   END ULTIMATE CYBERPUNK JAVASCRIPT
   ======================================== */
   /* ========================================
   ALTERNATIVE: If you want to add it separately
   ======================================== */

// OR add this as a separate initialization block:
document.addEventListener('DOMContentLoaded', function() {
    // Dedicated cyberpunk initialization check
    setTimeout(() => {
        if (document.body.classList.contains('theme-cyberpunk')) {
            console.log('🚀 Cyberpunk initial load detection - applying ultimate effects');
            applyGlitchEffects();
        }
    }, 1500);
});