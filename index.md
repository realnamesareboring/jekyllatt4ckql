---
layout: default
title: "ATT4CKQL"
is_home: true
show_theme_chooser: true
header:
  title: "ATT4CKQL"
  subtitle: "Enhanced KQL Queries for Microsoft Sentinel based on MITRE ATT&CK Techniques"
---

<div class="section" id="overview">
  <h2>1. Overview</h2>
  <p>ATT4CKQL is a comprehensive collection of Kusto Query Language (KQL) queries specifically designed for Microsoft Sentinel. These queries are mapped to MITRE ATT&CK techniques and are optimized to detect sophisticated threats across multiple detection sources.</p>
  <p>The project aims to provide security teams with ready-to-use, enhanced detection capabilities that leverage the power of Microsoft Sentinel while following the MITRE ATT&CK framework for a structured approach to threat detection.</p>
  <a href="https://github.com/realnamesareboring/ATT4CKQL" class="github-link">
    <svg height="20" width="20" viewBox="0 0 16 16" fill="white" style="margin-right: 8px;">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
    View on GitHub
  </a>
</div>

<div class="section" id="how-to-use">
  <h2>2. How to Use This Project</h2>
  <p>To make the most of ATT4CKQL, follow these steps:</p>
  <ol>
    <li><strong>Browse the Detection Sources</strong>: Use the table below to navigate to specific detection sources based on your environment.</li>
    <li><strong>Review the Queries</strong>: Each detection source page contains KQL queries mapped to specific MITRE ATT&CK techniques.</li>
    <li><strong>Implementation</strong>: Copy the queries and implement them in your Microsoft Sentinel environment.</li>
    <li><strong>Customization</strong>: Modify the queries as needed to fit your specific environment parameters.</li>
    <li><strong>Testing</strong>: Before deploying in production, test the queries in a controlled environment to validate their effectiveness.</li>
  </ol>
  <p>The queries in this project are categorized based on their use case:</p>
  <ul>
    <li><strong>Hunting Queries</strong>: For proactive threat hunting exercises</li>
    <li><strong>Near Real-Time Detection</strong>: For alerts that require immediate attention</li>
    <li><strong>Microsoft Sentinel Functions</strong>: Reusable query components that can be called from other queries</li>
  </ul>
</div>

<div class="section" id="table-of-contents">
  <h2>3. Table of Contents</h2>
  <p>Browse through our detection sources to find KQL queries relevant to your environment:</p>
  <table>
    <thead>
      <tr>
        <th>Detection Source</th>
        <th>Number of Queries</th>
        <th>Hunting Support</th>
        <th>Near Real-Time</th>
        <th>Sentinel Functions</th>
        <th>Last Updated</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="{{ '/platforms/aws/' | relative_url }}" class="source-link" data-source="aws">Amazon Web Services (AWS)</a></td>
        <td class="query-count"><span class="loading">Loading...</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td>2025-03-07</td>
      </tr>
      <tr>
        <td><a href="{{ '/platforms/azure/' | relative_url }}" class="source-link" data-source="azure">Azure</a></td>
        <td class="query-count"><span class="loading">Loading...</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td>2025-03-01</td>
      </tr>
      <tr>
        <td><a href="{{ '/platforms/active-directory/' | relative_url }}" class="source-link" data-source="active-directory">Active Directory</a></td>
        <td class="query-count"><span class="loading">Loading...</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td>2025-03-15</td>
      </tr>
      <tr>
        <td><a href="{{ '/platforms/gcp/' | relative_url }}" class="source-link" data-source="gcp">Google Cloud Platform (GCP)</a></td>
        <td class="query-count"><span class="loading">Loading...</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td><span class="tag tag-no">No</span></td>
        <td>2025-02-18</td>
      </tr>
      <tr>
        <td><a href="{{ '/platforms/entraid/' | relative_url }}" class="source-link" data-source="entraid">Entra ID (formerly Azure AD)</a></td>
        <td class="query-count"><span class="loading">Loading...</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td>2025-02-25</td>
      </tr>
      <tr>
        <td><a href="{{ '/platforms/office365/' | relative_url }}" class="source-link" data-source="office365">Microsoft 365</a></td>
        <td class="query-count"><span class="loading">Loading...</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td>2025-02-22</td>
      </tr>
      <tr>
        <td><a href="{{ '/platforms/defender/' | relative_url }}" class="source-link" data-source="defender">Microsoft Defender</a></td>
        <td class="query-count"><span class="loading">Loading...</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td><span class="tag tag-yes">Yes</span></td>
        <td>2025-03-05</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="section" id="best-practices">
  <h2>4. Best Practices</h2>
  <ul>
    <li><strong>Test queries in development environment first</strong> - Always validate queries against sample data before deploying to production</li>
    <li><strong>Customize thresholds and parameters</strong> - Adjust detection thresholds based on your environment's baseline</li>
    <li><strong>Review false positives regularly</strong> - Fine-tune queries to reduce noise while maintaining detection efficacy</li>
    <li><strong>Implement proper alerting</strong> - Set up appropriate notification channels and escalation procedures</li>
    <li><strong>Document customizations</strong> - Keep track of any modifications made to the base queries</li>
  </ul>
</div>

<footer>
  <p>&copy; 2025 ATT4CKQL Project. Enhanced KQL queries for Microsoft Sentinel.</p>
</footer>