/**
 * ATT4CKQL - Enhanced Cyberpunk Theme JavaScript
 * Complete theme system with Defender, Attacker, and Cyberpunk themes
 * Includes floating KQL effects, glitch animations, and theme management
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== THEME SYSTEM VARIABLES =====
    const themeChooser = document.getElementById('theme-chooser');
    const mainContent = document.getElementById('main-content');
    const defenderButton = document.getElementById('defender-button');
    const attackerButton = document.getElementById('attacker-button');
    const cyberpunkButton = document.getElementById('cyberpunk-button');
    const themeToggle = document.getElementById('theme-toggle');
    
    let currentTheme = 'defender';
    const themes = ['defender', 'attacker', 'cyberpunk'];
    
    // Set fixed counts for all detection sources
    const counts = {
        'active-directory': 42,
        'aws': 15, // Updated to match your actual AWS count
        'gcp': 28,
        'azure': 47,
        'entraid': 39,
        'office365': 31,
        'defender': 38
    };

    // ===== FLOATING KQL SYSTEM =====
    /**
     * Enhanced floating KQL - More frequent and varied
     * Creates floating KQL snippets from all edges of the screen
     */
    function createFloatingKQL() {
        if (currentTheme !== 'cyberpunk') return;
        
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
            'extend AccountDomain = split(Account, "\\\\")[0]',
            'order by TimeGenerated desc | take 100',
            'join kind=inner on Computer',
            'render timechart',
            'parse EventData with *',
            'mv-expand ParsedFields',
            'where Computer contains "DC"',
            'project-away TenantId, SourceSystem',
            'CommonSecurityLog | where DeviceAction != "allow"',
            'DnsEvents | where Name contains "suspicious"',
            'where TimeGenerated between (ago(7d)..ago(1d))',
            'datatable(EventID:int, Description:string)',
            'make-series Count=count() on TimeGenerated step 1h',
            'where SourceIP != "127.0.0.1"',
            'extend GeoLocation = geo_info_from_ip_address(SourceIP)',
            'where ProcessCommandLine contains "powershell"',
            'summarize EventCount=count() by Computer',
            'where LogonType in (2, 3, 10)',
            'project Computer, Account, LogonType, TimeGenerated'
        ];
        
        const snippet = kqlSnippets[Math.floor(Math.random() * kqlSnippets.length)];
        const floatingKQL = document.createElement('div');
        
        // More varied starting positions - all edges of screen
        const edge = Math.floor(Math.random() * 4); // 0=left, 1=right, 2=top, 3=bottom
        let startX, startY, endX, endY;
        
        switch(edge) {
            case 0: // From left
                startX = -300;
                startY = Math.random() * window.innerHeight;
                endX = window.innerWidth + 300;
                endY = startY + (Math.random() - 0.5) * 200;
                break;
            case 1: // From right
                startX = window.innerWidth + 300;
                startY = Math.random() * window.innerHeight;
                endX = -300;
                endY = startY + (Math.random() - 0.5) * 200;
                break;
            case 2: // From top
                startX = Math.random() * window.innerWidth;
                startY = -100;
                endX = startX + (Math.random() - 0.5) * 400;
                endY = window.innerHeight + 100;
                break;
            case 3: // From bottom
                startX = Math.random() * window.innerWidth;
                startY = window.innerHeight + 100;
                endX = startX + (Math.random() - 0.5) * 400;
                endY = -100;
                break;
        }
        
        floatingKQL.textContent = snippet;
        floatingKQL.style.cssText = `
            position: fixed;
            left: ${startX}px;
            top: ${startY}px;
            color: #00ffff;
            font-family: 'Share Tech Mono', monospace;
            font-size: ${10 + Math.random() * 6}px;
            opacity: ${0.08 + Math.random() * 0.12};
            z-index: 1;
            pointer-events: none;
            white-space: nowrap;
            transition: all ${15 + Math.random() * 15}s linear;
            transform: rotate(${-3 + Math.random() * 6}deg);
        `;
        
        document.body.appendChild(floatingKQL);
        
        requestAnimationFrame(() => {
            floatingKQL.style.left = endX + 'px';
            floatingKQL.style.top = endY + 'px';
            floatingKQL.style.opacity = '0';
        });
        
        setTimeout(() => {
            if (floatingKQL.parentNode) {
                floatingKQL.remove();
            }
        }, 30000);
    }
    
    /**
     * Starts the floating KQL effect system
     * Creates initial burst and continues periodic generation
     */
    function startFloatingKQL() {
        if (currentTheme !== 'cyberpunk') return;
        
        // Create initial burst of floating KQL
        for (let i = 0; i < 5; i++) {
            setTimeout(() => createFloatingKQL(), i * 1000);
        }
        
        // Continue creating them more frequently
        const interval = setInterval(() => {
            if (currentTheme === 'cyberpunk') {
                // Create 1-3 floating KQL streams at once
                const count = 1 + Math.floor(Math.random() * 3);
                for (let i = 0; i < count; i++) {
                    setTimeout(() => createFloatingKQL(), i * 500);
                }
            } else {
                clearInterval(interval);
            }
        }, 4000); // Every 4 seconds instead of 10
    }

    // ===== THEME MANAGEMENT SYSTEM =====
    /**
     * Sets the active theme and applies all necessary effects
     * @param {string} theme - 'defender', 'attacker', or 'cyberpunk'
     */
    function setTheme(theme) {
        currentTheme = theme;
        
        // Remove all theme classes
        document.body.classList.remove('theme-attacker', 'theme-cyberpunk');
        
        // Add appropriate theme class
        if (theme === 'attacker') {
            document.body.classList.add('theme-attacker');
        } else if (theme === 'cyberpunk') {
            document.body.classList.add('theme-cyberpunk');
            
            // Add glitch effects to title and subtitle
            setTimeout(() => {
                const title = document.querySelector('h1');
                const subtitle = document.querySelector('.subtitle');
                
                if (title) {
                    title.classList.add('glitch');
                    // Restart glitch animation periodically
                    setInterval(() => {
                        if (currentTheme === 'cyberpunk') {
                            title.classList.remove('glitch');
                            setTimeout(() => title.classList.add('glitch'), 100);
                        }
                    }, 8000); // Glitch every 8 seconds
                }
                
                if (subtitle) {
                    // Add terminal typing effect initially
                    subtitle.classList.add('terminal-typing');
                    
                    // Then add occasional glitch
                    setTimeout(() => {
                        setInterval(() => {
                            if (currentTheme === 'cyberpunk') {
                                subtitle.classList.add('glitch');
                                setTimeout(() => subtitle.classList.remove('glitch'), 2000);
                            }
                        }, 12000); // Glitch every 12 seconds
                    }, 4000);
                }
                
                startFloatingKQL();
            }, 1000);
        }
        
        sessionStorage.setItem('att4ckql-theme', theme);
        console.log('Theme set to:', theme);
    }
    
    /**
     * Simple theme transition without complex animations
     * @param {string} theme - Target theme name
     */
    function transitionToTheme(theme) {
        console.log('Transitioning to theme:', theme);
        themeChooser.style.opacity = '0';
        setTimeout(() => {
            themeChooser.style.display = 'none';
            mainContent.classList.add('visible');
            setTheme(theme);
            updateCounts(); // Update query counts when theme is set
        }, 500);
    }

    // ===== QUERY COUNT MANAGEMENT =====
    /**
     * Function to count KQL files dynamically from GitHub repository
     * Falls back to static counts if GitHub API fails
     */
    function countKQLFiles() {
        const repoOwner = "realnamesareboring"; // Your GitHub username
        const repoName = "ATT4CKQL"; // Your repository name
        const apiBaseUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/`;
        
        // Define the folders to check, with both options
        const folders = {
            'active-directory': ['Active Directory/Queries', 'Active Directory'],
            'aws': ['Amazon Web Services/Queries', 'Amazon Web Services'],
            'gcp': ['Google Cloud Platform/Queries', 'Google Cloud Platform'],
            'azure': ['Azure/Queries', 'Azure'],
            'entraid': ['Entra ID/Queries', 'Entra ID'],
            'office365': ['Microsoft 365/Queries', 'Microsoft 365'],
            'defender': ['Microsoft Defender for Endpoint/Queries', 'Microsoft Defender for Endpoint']
        };
        
        /**
         * Count files in a specific folder
         * @param {Array} folderPaths - Array of possible folder paths to try
         * @returns {Promise<number>} - Number of KQL files found
         */
        async function countFilesInFolder(folderPaths) {
            let kqlCount = 0;
            
            // Try each possible folder path in order
            for (const folderPath of folderPaths) {
                try {
                    console.log(`Checking folder: ${folderPath}`);
                    const response = await fetch(apiBaseUrl + folderPath);
                    
                    if (!response.ok) {
                        console.log(`Folder not found or not accessible: ${folderPath}, trying next option...`);
                        continue; // Try the next folder path
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
                    return kqlCount; // Return after successfully counting the first valid folder
                } catch (error) {
                    console.error(`Error with folder ${folderPath}:`, error);
                    // Continue to the next folder path
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

    /**
     * Function to update counts in the table - use hardcoded counts as fallback
     */
    function updateCounts() {
        const sourceLinks = document.querySelectorAll('.source-link[data-source]');
        
        sourceLinks.forEach(link => {
            const sourceId = link.getAttribute('data-source');
            const countCell = link.closest('tr').querySelector('.query-count');
            
            if (countCell) {
                // Set the count directly from our fixed values
                const count = counts[sourceId] || 0;
                countCell.textContent = count;
                
                // Add highlight effect
                countCell.classList.add('updated');
                setTimeout(() => {
                    countCell.classList.remove('updated');
                }, 2000);
            }
        });
    }

    /**
     * Function to initialize the page with dynamic KQL counts or fallback to static counts
     */
    function initializeWithCounts() {
        // Try dynamic counting first
        try {
            countKQLFiles();
        } catch (error) {
            console.error("Error counting KQL files dynamically:", error);
            // Fall back to static counts if dynamic counting fails
            updateCounts();
        }
    }

    // ===== EVENT LISTENERS =====
    
    // Handle theme button clicks with enhanced effects
    if (defenderButton) {
        defenderButton.addEventListener('click', function() {
            transitionToTheme('defender');
        });
    }

    if (attackerButton) {
        attackerButton.addEventListener('click', function() {
            transitionToTheme('attacker');
        });
    }

    if (cyberpunkButton) {
        cyberpunkButton.addEventListener('click', function() {
            transitionToTheme('cyberpunk');
        });
    }

    // Enhanced theme toggle - cycles through all three themes
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentIndex = themes.indexOf(currentTheme);
            const nextIndex = (currentIndex + 1) % themes.length;
            const nextTheme = themes[nextIndex];
            console.log('Toggling from', currentTheme, 'to', nextTheme);
            setTheme(nextTheme);
        });
    }

    // ===== KEYBOARD SHORTCUTS =====
    
    // Keyboard shortcuts for cyberpunk theme
    document.addEventListener('keydown', function(event) {
        if (currentTheme === 'cyberpunk') {
            // Manual glitch trigger
            if (event.code === 'KeyG' && event.ctrlKey) {
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
            
            // Burst of floating KQL
            if (event.code === 'KeyK' && event.ctrlKey && event.shiftKey) {
                for (let i = 0; i < 8; i++) {
                    setTimeout(() => createFloatingKQL(), i * 200);
                }
            }
        }
    });

    // ===== INITIALIZATION =====
    
    // Initialize the page
    console.log('Clean cyberpunk theme loaded - no complex animations');
    
    // Check if we're on the main page (has theme chooser) or sub-page
    if (themeChooser) {
        // Main page - show theme chooser
        console.log('Main page detected - theme chooser active');
    } else {
        // Sub-page - apply saved theme or default
        const savedTheme = sessionStorage.getItem('att4ckql-theme') || 'defender';
        setTheme(savedTheme);
        
        // Show main content immediately on sub-pages
        if (mainContent) {
            mainContent.classList.add('visible');
        }
        
        console.log('Sub-page detected - applied theme:', savedTheme);
    }

    // ===== CLEANUP AND UTILITY FUNCTIONS =====
    
    /**
     * Clean up floating elements on window resize
     */
    window.addEventListener('resize', function() {
        if (currentTheme === 'cyberpunk') {
            // Clean up any floating elements that might be off-screen
            const floatingElements = document.querySelectorAll('div[style*="position: fixed"][style*="Share Tech Mono"]');
            floatingElements.forEach(el => {
                if (!el.classList.contains('code-streams')) {
                    el.remove();
                }
            });
        }
    });

    /**
     * Force the theme chooser to always show on main page reload
     * This clears any stored theme preference to ensure theme selection
     */
    window.onbeforeunload = function() {
        // Only clear theme on main page (with theme chooser)
        if (themeChooser) {
            localStorage.removeItem('att4ckql-theme');
        }
        return null; // Allows page to unload normally
    };

    // ===== CONSOLE BRANDING =====
    
    // Console ASCII art for cyberpunk theme (desktop only)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
        console.log(`
    ╔══════════════════════════════════════╗
    ║        ATT4CKQL NEURAL NET           ║
    ║     Enhanced Theme System v3.0       ║
    ║                                      ║
    ║  > Defender Theme: LOADED            ║
    ║  > Attacker Theme: LOADED            ║
    ║  > Cyberpunk Theme: LOADED           ║
    ║  > Floating KQL: READY               ║
    ║  > Glitch Effects: READY             ║
    ║                                      ║
    ║  Keyboard Shortcuts:                 ║
    ║  • Ctrl+G: Trigger Glitch           ║
    ║  • Ctrl+Shift+K: KQL Burst          ║
    ║                                      ║
    ║  Welcome to the Matrix, netrunner.   ║
    ╚══════════════════════════════════════╝
        `);
    }

    // ===== EXPORT FOR DEBUGGING =====
    
    // Make key functions available globally for debugging
    window.ATT4CKQL = {
        setTheme: setTheme,
        createFloatingKQL: createFloatingKQL,
        updateCounts: updateCounts,
        currentTheme: () => currentTheme,
        version: '3.0.0'
    };
});