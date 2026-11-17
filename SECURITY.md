# Data privacy and security boundaries

SpecPilot Pro is a browser-side rules and templates product. It does not require sign-up or API credentials, does not execute user-supplied code and does not upload a draft to a remote AI service.

The project text is held in memory during the tool session. **Only** when the user explicitly clicks "Request a project proposal" does the browser place a short summary in same-origin sessionStorage under nextgen_specpilot_handoff. The destination website reads that summary, pre-fills its existing project inquiry form, and removes the temporary entry. The user can edit/review it before manually submitting.

The tool does not submit the inquiry automatically. Do not put client secrets, passwords or API credentials in the brief. Avoid leaking sensitive detail in exported files or email attachments.

Threat model and limitations:
- Static category templates may omit important domain requirements or controls. Human review is essential.
- Readiness and complexity scores are custom heuristics, not predictive AI, professional certifications or financial quotations.
- Automatic contact handoff is same-origin only and must be checked when integrating into another website.
- No project content is included in URLs, browser analytics events, third-party scripts or search indexing.
- The web host may still have standard HTTP access logs and site-level analytics.

Report problems through GitHub issues without including personal information.
