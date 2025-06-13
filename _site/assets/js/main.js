/**
 * Main Index Script - Theme Selection and Query Count Management
 * For the main ATT4CKQL landing page
 */

/*
document.addEventListener('DOMContentLoaded', function() {
    const themeChooser = document.getElementById('theme-chooser');
    const mainContent = document.getElementById('main-content');
    const defenderButton = document.getElementById('defender-button');
    const attackerButton = document.getElementById('attacker-button');
    const themeToggle = document.getElementById('theme-toggle');
*/

document.addEventListener('DOMContentLoaded', function() {
    const themeChooser = document.getElementById('theme-chooser');
    const mainContent = document.getElementById('main-content');
    defenderButton.addEventListener('click', function() {
    attackerButton.addEventListener('click', function() {
    themeToggle.addEventListener('click', function() {

    // Set fixed counts initially (can be updated with Jekyll later)
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
        const repoName = "ATT4CKQL";
        const apiBaseUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/`;
        
        // Define the folders to check
        const folders = {
            'active-directory': ['Active Directory/Queries', 'Active Directory'],
            'aws': ['Amazon Web Services/Queries', 'Amazon Web Services'],
            'gcp': ['Google Cloud Platform/Queries', 'Google Cloud Platform'],
            'azure': ['Azure/Queries', 'Azure'],
            'entraid': ['Entra ID/Queries', 'Entra ID'],
            'office365': ['Microsoft 365/Queries', 'Microsoft 365'],
            'defender': ['Microsoft Defender for Endpoint/Queries', 'Microsoft Defender for Endpoint']
        };
        
        // Function to count .kql files in a specific folder
        async function countFilesInFolder(folderPaths) {
            let kqlCount = 0;
            
            // Try each possible folder path in order
            for (const folderPath of folderPaths) {
                try {
                    console.log(`Checking folder: ${folderPath}`);
                    const response = await fetch(apiBaseUrl + folderPath);
                    
                    if (!response.ok) {
                        console.log(`Folder not found or not accessible: ${folderPath}, trying next option...`);
                        continue;
                    }
                    
                    const contents = await response.json();
                    
                    // Count all .kql files directly in this folder
                    for (const item of contents) {
                        if (item.type === 'file' && item.name.toLowerCase().endsWith('.kql')) {
                            console.log(`Found KQL file: ${item.name} in ${folderPath}`);
                            kqlCount++;
                        }
                    }
                    
                    console.log(`Found ${kqlCount} KQL files in ${folderPath}`);
                    return kqlCount;
                } catch (error) {
                    console.error(`Error with folder ${folderPath}:`, error);
                }
            }
            
            console.log(`No valid folders found for counting KQL files, total: ${kqlCount}`);
            return kqlCount;
        }
        
        // Update count for each detection source
        const sourceLinks = document.querySelectorAll('.source-link[data-source]');
        
        sourceLinks.forEach(async (link) => {
            const sourceId = link.getAttribute('data-source');
            const countCell = link.closest('tr').querySelector('.query-count');
            
            if (folders[sourceId]) {
                countCell.innerHTML = '<span class="loading">Counting...</span>';
                
                try {
                    const count = await countFilesInFolder(folders[sourceId]);
                    // Update our counts object with the actual count
                    counts[sourceId] = count;
                    countCell.textContent = count;
                    
                    // Add highlight effect
                    countCell.classList.add('updated');
                    setTimeout(() => {
                        countCell.classList.remove('updated');
                    }, 2000);
                } catch (error) {
                    console.error(`Error updating count for ${sourceId}:`, error);
                    countCell.textContent = counts[sourceId] || '?';
                }
            }
        });
    }

    // Function to update counts in the table - use hardcoded counts as fallback
    function updateCounts() {
        const sourceLinks = document.querySelectorAll('.source-link[data-source]');
        let totalCount = 0;
        
        sourceLinks.forEach(link => {
            const sourceId = link.getAttribute('data-source');
            const countCell = link.closest('tr').querySelector('.query-count');
            
            // Set the count directly from our fixed values
            const count = counts[sourceId] || 0;
            countCell.textContent = count;
            totalCount += count;
            
            // Add highlight effect
            countCell.classList.add('updated');
            setTimeout(() => {
                countCell.classList.remove('updated');
            }, 2000);
        });
        
        // Update the results count in header
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            resultsCount.textContent = `${Object.keys(counts).length} sources (${totalCount} total queries)`;
        }
    }

    // Function to set the chosen theme
    function setTheme(theme) {
        if (theme === 'attacker') {
            document.body.classList.add('theme-attacker');
            sessionStorage.setItem('att4ckql-theme', 'attacker');
        } else {
            document.body.classList.remove('theme-attacker');
            sessionStorage.setItem('att4ckql-theme', 'defender');
        }
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

    // Check if theme was previously selected
    const savedTheme = sessionStorage.getItem('att4ckql-theme');
    if (savedTheme) {
        // Skip theme chooser if theme was already selected
        themeChooser.style.display = 'none';
        mainContent.classList.add('visible');
        setTheme(savedTheme);
        initializeWithCounts();
    } else {
        // Show theme chooser for new visitors
        themeChooser.style.display = 'flex';
    }

    // Handle defender theme selection
    defenderButton.addEventListener('click', function() {
        themeChooser.style.opacity = '0';
        setTimeout(() => {
            themeChooser.style.display = 'none';
            mainContent.classList.add('visible');
            setTheme('defender');
            initializeWithCounts();
        }, 500);
    });

    // Handle attacker theme selection
    attackerButton.addEventListener('click', function() {
        themeChooser.style.opacity = '0';
        setTimeout(() => {
            themeChooser.style.display = 'none';
            mainContent.classList.add('visible');
            setTheme('attacker');
            initializeWithCounts();
        }, 500);
    });

    // Theme toggle button functionality
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            if (document.body.classList.contains('theme-attacker')) {
                setTheme('defender');
            } else {
                setTheme('attacker');
            }
        });
    }

    // Add some interactive enhancements
    addInteractiveEnhancements();
});

/**
 * Add interactive enhancements to the main page
 */
function addInteractiveEnhancements() {
    // Add hover effects to detection source links
    const sourceLinks = document.querySelectorAll('.source-link');
    sourceLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const row = this.closest('tr');
            row.style.transform = 'translateX(5px)';
            row.style.boxShadow = '0 2px 8px rgba(0, 120, 212, 0.2)';
        });
        
        link.addEventListener('mouseleave', function() {
            const row = this.closest('tr');
            row.style.transform = 'translateX(0)';
            row.style.boxShadow = 'none';
        });
    });

    // Add click tracking for analytics (optional)
    sourceLinks.forEach(link => {
        link.addEventListener('click', function() {
            const source = this.getAttribute('data-source');
            console.log(`User navigated to: ${source}`);
            // You could add analytics tracking here if needed
        });
    });

    // Smooth scrolling for internal links
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Clear any stored theme preference on page unload to ensure theme chooser shows
// (Remove this if you want to remember theme selection permanently)
window.addEventListener('beforeunload', function() {
    // Uncomment the line below if you want to always show theme chooser
    // sessionStorage.removeItem('att4ckql-theme');
});

// Add some utility functions for potential future use
window.ATT4CKQL = {
    // Utility to manually refresh counts
    refreshCounts: function() {
        const event = new CustomEvent('countsRefresh');
        document.dispatchEvent(event);
    },
    
    // Utility to get current theme
    getCurrentTheme: function() {
        return document.body.classList.contains('theme-attacker') ? 'attacker' : 'defender';
    },
    
    // Utility to switch theme programmatically
    setTheme: function(theme) {
        if (theme === 'attacker') {
            document.body.classList.add('theme-attacker');
            sessionStorage.setItem('att4ckql-theme', 'attacker');
        } else {
            document.body.classList.remove('theme-attacker');
            sessionStorage.setItem('att4ckql-theme', 'defender');
        }
    }
};