/**
 * Main Index Script - Theme Selection and Query Count Management
 * For the main ATT4CKQL landing page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements with null checks
    const themeChooser = document.getElementById('theme-chooser');
    const mainContent = document.getElementById('main-content');
    const defenderButton = document.querySelector('.defender-button');
    const attackerButton = document.querySelector('.attacker-button');
    const themeToggle = document.getElementById('theme-toggle');

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
            'active-directory': ['Active Directory/Queries'],
            'aws': ['Amazon Web Services/Queries'],
            'gcp': ['Google Cloud Platform/Queries'],
            'azure': ['Azure/Queries'],
            'entraid': ['Entra ID/Queries'],
            'office365': ['Office 365/Queries'],
            'defender': ['Microsoft Defender/Queries']
        };

        // Count files for each platform
        Object.keys(folders).forEach(platform => {
            let platformCount = 0;
            const platformFolders = folders[platform];
            
            // Process each folder for this platform
            platformFolders.forEach(folderPath => {
                fetch(`${apiBaseUrl}${encodeURIComponent(folderPath)}`)
                    .then(response => response.json())
                    .then(data => {
                        if (Array.isArray(data)) {
                            const kqlFiles = data.filter(file => 
                                file.name.toLowerCase().endsWith('.kql') && file.type === 'file'
                            );
                            platformCount += kqlFiles.length;
                        }
                    })
                    .catch(error => {
                        console.warn(`Could not fetch ${folderPath}:`, error);
                        // Use fallback count if GitHub API fails
                        platformCount = counts[platform] || 0;
                    })
                    .finally(() => {
                        // Update the counts object with fetched data
                        counts[platform] = platformCount;
                        // Update display after fetching
                        updateCounts();
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

    // Check for saved theme preference
    const savedTheme = sessionStorage.getItem('att4ckql-theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }

    // Initialize counts on page load
    initializeWithCounts();

    // Expose functions globally for the theme chooser buttons in HTML
    window.showMain = function(theme) {
        setTheme(theme);
        if (themeChooser) themeChooser.style.display = 'none';
        if (mainContent) {
            mainContent.style.display = 'block';
            mainContent.style.opacity = '1';
            mainContent.classList.add('visible');
        }
    };
});