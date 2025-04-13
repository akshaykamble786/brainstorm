import {
  FileText,
  FileHeart,
  FileSignature,
  FileClock,
  FileCheck,
  FileSpreadsheet,
  GraduationCap,
  FileCode,
  Scale,
  Users,
  Calendar,
} from "lucide-react";

export const templateCategories = [
  {
    id: "all",
    name: "All Templates",
  },
  {
    id: "personal",
    name: "Personal",
  },
  {
    id: "work",
    name: "Work",
  },
  {
    id: "education",
    name: "Education",
  },
  {
    id: "legal",
    name: "Legal",
  },
];

export const templates = [
  {
    id: "resume",
    name: "Resume",
    description: "Professional resume template",
    icon: FileHeart,
    categories: ["all", "personal"],
    status: "Free",
    content: `<h1>Your Name</h1>
<p>Email: your.email@example.com | Phone: (123) 456-7890 | Location: City, State | LinkedIn: linkedin.com/in/yourname | Portfolio: yourportfolio.com</p>
<p>______________________________________________________</p>

<h2><b>Professional Summary</b></h2>
<p>Results-driven and detail-oriented [Your Profession] with over [X] years of experience in [Industry/Field]. Proven ability to lead cross-functional teams, manage complex projects from conception to completion, and drive measurable outcomes. Skilled in [List 2-3 skills], with a passion for leveraging data and technology to deliver innovative solutions. Seeking to contribute expertise and leadership to a dynamic and forward-thinking organization.</p>
<p>______________________________________________________</p>

<h2><b>Work Experience</b></h2>

<h3>Senior Job Title | Company Name – City, State</h3>
<p><i>Month Year – Present</i></p>
<ul>
  <li>Led a team of [#] professionals in delivering end-to-end solutions for [project or product], resulting in a [percentage]% increase in [KPI/metric].</li>
  <li>Redesigned workflow processes that reduced project delivery time by [X]% and improved client satisfaction ratings.</li>
  <li>Collaborated cross-functionally with design, engineering, and sales teams to streamline operations and support business development.</li>
</ul>

<h3>Job Title | Previous Company – City, State</h3>
<p><i>Month Year – Month Year</i></p>
<ul>
  <li>Managed a portfolio of [X] clients and consistently exceeded quarterly revenue goals by [X]%. </li>
  <li>Developed and implemented training programs that improved team productivity and onboarding efficiency.</li>
  <li>Created comprehensive reports and dashboards to provide actionable insights to stakeholders.</li>
</ul>

<p>______________________________________________________</p>

<h2><b>Education</b></h2>

<p>Bachelor of [Field of Study] | University Name – City, State</p>
<p><i>Graduated: Year</i></p>
  <li>Relevant Coursework: [Course 1], [Course 2], [Course 3]</li>
  <li>Achievements: Dean’s List (X semesters), Student Leadership Award</li>

<p>______________________________________________________</p>

<h2><b>Skills</b></h2>
<ul>
  <li>Technical Skills: [List relevant tools/languages/frameworks]</li>
  <li>Soft Skills: Communication, Leadership, Critical Thinking, Adaptability</li>
  <li>Languages: English (Fluent), Spanish (Conversational)</li>
</ul>
<p>______________________________________________________</p>

<h2><b>Certifications</b></h2>

  <li>Certified [Skill/Role] – Issued by [Organization], [Year]</li>
  <li>Scrum Master (CSM) – Scrum Alliance, [Year]</li>

<h2><b>Projects</b></h2>
  <li>Project Name: Description of project, the role you played, and the results achieved.</li>
  <li>Open Source Contribution: Contributed to [repo/project], helping improve [feature/bug].</li>
<p>______________________________________________________</p>

<h2><b>References</b></h2>
<p>Available upon request.</p>
`,
  },
  {
    id: "cover-letter",
    name: "Cover Letter",
    description: "Formal cover letter for job applications",
    icon: FileSignature,
    categories: ["all", "personal"],
    status: "Free",
    content: `<p>Your Name<br>Your Address<br>City, State ZIP<br>Email: your.email@example.com<br>Phone: (123) 456-7890</p>

<p>Date: [Insert Date]</p>

<p>Hiring Manager's Name<br>Company Name<br>Company Address<br>City, State ZIP</p>

<p>Dear [Hiring Manager's Name],</p>

<p>I am excited to submit my application for the [Job Title] position at [Company Name], as advertised on [Job Platform/Website]. With a strong foundation in [Relevant Field] and over [X] years of hands-on experience driving innovation and efficiency in high-performing teams, I am confident in my ability to make a meaningful impact at your organization.</p>

<p>In my current role as [Your Current Job Title] at [Your Company], I have spearheaded initiatives that streamlined internal operations, resulting in a [XX]% increase in productivity and a significant reduction in costs. One of my proudest achievements includes leading the development of [describe a project or product], which enhanced user engagement by [XX]% and received recognition across the company.</p>

<p>Beyond my technical capabilities, I bring a proactive mindset and collaborative spirit. I thrive in fast-paced environments and excel in cross-functional teams where clear communication and a shared vision are key. I am especially drawn to [Company Name]’s commitment to [insert specific company values/initiatives] and am eager to contribute to [insert specific project or team they’re known for, if applicable].</p>

<p>I believe my skills in [list key skills relevant to job posting], coupled with my ability to adapt and lead through change, make me a strong candidate for this opportunity. I am confident that I can bring both immediate and long-term value to your team.</p>

<p>I would welcome the chance to further discuss how my experience and enthusiasm align with [Company Name]’s goals. Please feel free to contact me at your earliest convenience to schedule a conversation.</p>

<p>Thank you for your time and consideration.</p>

<p>Sincerely,<br>Your Name</p>
`,
  },
  {
    id: "legal-contract",
    name: "Legal Contract",
    description: "Standard legal contract template",
    icon: Scale,
    categories: ["all", "legal"],
    status: "Pro",
    content: `<h1>Service Agreement</h1>
    <p>This Agreement is made and entered into on [MM/DD/YYYY] by and between:</p>
    <ul>
      <li><strong>Client:</strong> [Client Full Name], located at [Address]</li>
      <li><strong>Service Provider:</strong> [Your Name/Company], located at [Your Address]</li>
    </ul>
    <p>______________________________________________________</p>

    <h2><b>1. Scope of Services</b></h2>
    <p>The Service Provider agrees to provide the following services:</p>
    <ul>
      <li>[Service 1 – e.g., Website Development, Content Creation]</li>
      <li>[Service 2 – e.g., SEO Optimization, Technical Support]</li>
    </ul>
    <p>All services will be performed according to industry standards and delivered by [target date or timeframe].</p>
    
    <h2><b>2. Payment Terms</b></h2>
    <ul>
      <li>Total Contract Amount: $[Amount]</li>
      <li>Payment Schedule:
        <ul>
          <li>50% upfront ($[Amount]) upon contract signing</li>
          <li>50% upon completion ($[Amount])</li>
        </ul>
      </li>
      <li>Accepted Payment Methods: [e.g., Bank Transfer, PayPal]</li>
    </ul>
    
    <h2><b>3. Timeline</b></h2>
    <p>The expected project timeline is from [Start Date] to [End Date], subject to change upon mutual agreement. Any delays caused by client in delivering necessary materials or approvals may result in adjusted deadlines.</p>
    
    <h2><b>4. Revisions</b></h2>
    <p>The client is entitled to [number] revisions per deliverable. Additional revisions beyond the included number will be billed at a rate of $[rate]/hour.</p>
    
    <h2><b>5. Confidentiality</b></h2>
    <p>Both parties agree to maintain the confidentiality of any proprietary or sensitive information exchanged during the term of this agreement.</p>
    
    <h2><b>6. Intellectual Property</b></h2>
    <p>Upon full payment, the Client will own all intellectual property rights to the final deliverables. The Service Provider reserves the right to display work samples in their portfolio unless otherwise agreed in writing.</p>
    
    <h2><b>7. Termination Clause</b></h2>
    <p>This Agreement may be terminated by either party with [X] days written notice. Upon termination, the Client shall pay for all completed work and reimbursable expenses to date.</p>
    
    <h2><b>8. Dispute Resolution</b></h2>
    <p>In case of disputes, both parties agree to resolve the matter amicably. If unresolved, disputes shall be settled through mediation or arbitration in the jurisdiction of [City, State].</p>
    <p>______________________________________________________</p>

    <h2><b>Signatures</b></h2>
    <p>By signing below, both parties agree to the terms outlined in this Agreement.</p>
    
    <p><strong>Client Signature:</strong> ______________________  Date: ___________</p>
    <p><strong>Service Provider Signature:</strong> ______________________  Date: ___________</p>
    `,
  },
  {
    id: "meeting-minutes",
    name: "Minutes of Meeting",
    description: "Structured template for meeting notes",
    icon: FileClock,
    categories: ["all", "work"],
    status: "Free",
    content: `<h1>Minutes of Meeting</h1>
<p><strong>Meeting Title:</strong> [Weekly Team Sync / Project Kickoff]</p>
<p><strong>Date:</strong> [MM/DD/YYYY]</p>
<p><strong>Time:</strong> [Start Time] – [End Time]</p>
<p><strong>Location:</strong> [Meeting Room / Zoom / Google Meet]</p>
<p><strong>Facilitator:</strong> [Name]</p>
<p><strong>Note Taker:</strong> [Name]</p>
<p>______________________________________________________</p>

<h2><b>Attendees</b></h2>
<ul>
  <li>[Name 1] – [Role]</li>
  <li>[Name 2] – [Role]</li>
  <li>[Name 3] – [Role]</li>
</ul>
<p>______________________________________________________</p>

<h2><b>Agenda</b></h2>
<ol>
  <li>Finalize budget allocations</li>
  <li>Share meeting summary with all stakeholders</li>
  <li>Send updated timelines to the team</li>
</ol>
<p>______________________________________________________</p>

<h2><b>Discussion Notes</b></h2>
<ul>
  <li><strong>Project Update:</strong> Feature A is completed. Feature B is in testing. Feature C is delayed due to API issues.</li>
  <li><strong>Blockers:</strong> Waiting for design assets from marketing. Backend team flagged database scaling concerns.</li>
  <li><strong>Decisions Made:</strong> Shift release date to next Friday. Replace vendor X with internal solution for analytics.</li>
</ul>
<p>______________________________________________________</p>

  <h2><b>Action Items</b></h2>
  <ul>
<li><strong>Task Owner Due Date:</strong> [MM/DD/YYYY]</li>
<li><strong>Task Owner Due Date:</strong> [MM/DD/YYYY]</li>
<li><strong>Send updated timeline to stakeholders:</strong> [Time]</li>
<li><strong>Review hosting budget:</strong> [Room or Link]</li>
</ul>
<p>______________________________________________________</p>

<h2><b>Next Meeting</b></h2>
<p><strong>Date:</strong> [MM/DD/YYYY]</p>
<p><strong>Time:</strong> [Time]</p>
<p><strong>Location:</strong> [Room or Link]</p>
`,
  },
  {
    id: "project-proposal",
    name: "Project Proposal",
    description: "Detailed project proposal template",
    icon: FileCheck,
    categories: ["all", "work"],
    status: "Free",
    content: `<h1>Project Proposal</h1>
<p><strong>Project Title:</strong> [Innovative Project Title Here]</p>
<p><strong>Prepared by:</strong> Your Name – Your Position</p>
<p><strong>Date:</strong> [MM/DD/YYYY]</p>
<p>______________________________________________________</p>
<h2><b>1. Executive Summary</b></h2>
<p>This proposal outlines the plan for [Project Title], a comprehensive initiative aimed at solving [briefly state the problem] through innovative and scalable solutions. The goal is to achieve [desired outcome] while aligning with the organization’s long-term vision of [insert strategic goal].</p>
<p>______________________________________________________</p>

<h2><b>2. Objectives</b></h2>
<ul>
  <li>Improve [metric] by [X]% within [timeframe].</li>
  <li>Deploy a working prototype/MVP by [date].</li>
  <li>Enhance user experience through [key feature or innovation].</li>
</ul>
<p>______________________________________________________</p>

<h2><b>3. Background & Rationale</b></h2>
<p>Currently, [describe the current situation or problem]. Market research and internal feedback indicate a growing demand for [proposed solution/feature]. Implementing this project will not only address current challenges but also position us competitively in the industry.</p>
<p>______________________________________________________</p>

<h2><b>4. Scope of Work</b></h2>
<p>This project will include the following phases:</p>
<ul>
  <li><strong>Phase 1:</strong> Research and discovery – Requirements gathering, stakeholder interviews, market analysis.</li>
  <li><strong>Phase 2:</strong> Design and prototyping – UI/UX design, architecture planning, feedback sessions.</li>
  <li><strong>Phase 3:</strong> Development and testing – Agile sprints, unit/integration testing, QA reviews.</li>
  <li><strong>Phase 4:</strong> Deployment and monitoring – Launch, user training, performance tracking.</li>
</ul>
<p>______________________________________________________</p>

<h2><b>5. Timeline</b></h2>

  <p>Milestone : Target Date</p>
  <p>Project Kickoff : [MM/DD/YYYY]</p>
  <p>Phase 1 Completion : [MM/DD/YYYY]</p>
  <p>Beta Testing Launch : [MM/DD/YYYY]</p>
  <p>Go Live : [MM/DD/YYYY]</p>
<p>______________________________________________________</p>

<h2><b>6. Budget</b></h2>
<p>Estimated total cost: $[XX,XXX]</p>
  <li>Personnel: $[XX,XXX]</li>
  <li>Software/Tools: $[X,XXX]</li>
  <li>Marketing & Launch: $[X,XXX]</li>
  <li>Contingency: $[X,XXX]</li>
  <p>______________________________________________________</p>

<h2><b>7. Success Metrics</b></h2>
<ul>
<li>Increase in [user engagement/sales/productivity] by [X]%.</li>
  <li>[X]% reduction in [time/cost/errors] compared to baseline.</li>
  <li>Customer satisfaction score above [X] post-launch.</li>
</ul>
  <p>______________________________________________________</p>

<h2><b>8. Stakeholders</b></h2>
<ul>
  <li><strong>Project Sponsor:</strong> [Name], [Title]</li>
  <li><strong>Project Manager:</strong> [Name], [Title]</li>
  <li><strong>Technical Lead:</strong> [Name]</li>
  <li><strong>Design Lead:</strong> [Name]</li>
</ul>

<p>______________________________________________________</p>
<h2><b>9. Conclusion</b></h2>
<p>This project represents a high-impact opportunity to enhance our capabilities and deliver value to our users. Approval and funding are requested to move forward with execution.</p>
`,
  },
  {
    id: "nda",
    name: "NDA",
    description: "Non-disclosure agreement template",
    icon: FileSignature,
    categories: ["all", "legal"],
    status: "Pro",
    content: `<h1>Non-Disclosure Agreement (NDA)</h1>
<p>This Non-Disclosure Agreement (“Agreement”) is entered into as of [MM/DD/YYYY], by and between:</p>
<ul>
  <li><strong>Disclosing Party:</strong> [Name / Company Name], located at [Address]</li>
  <li><strong>Receiving Party:</strong> [Name / Individual], located at [Address]</li>
</ul>
<p>______________________________________________________</p>

<h2><b>1. Purpose</b></h2>
<p>The Disclosing Party intends to disclose certain confidential information to the Receiving Party for the purpose of [brief description – e.g., evaluating a potential partnership, product collaboration, etc.].</p>
<p>______________________________________________________</p>

<h2><b>2. Definition of Confidential Information</b></h2>
<p>“Confidential Information” means all non-public, proprietary, or sensitive information including but not limited to technical data, trade secrets, software, customer data, strategies, and financial information.</p>
<p>______________________________________________________</p>

<h2><b>3. Obligations of Receiving Party</b></h2>
<ul>
  <li>Maintain confidentiality and take reasonable care to protect the information.</li>
  <li>Not disclose to third parties without written consent.</li>
  <li>Use the information solely for the agreed-upon purpose.</li>
</ul>
<p>______________________________________________________</p>

<h2><b>4. Exclusions</b></h2>
<p>This Agreement does not apply to information that is:
<ul>
  <li>Publicly available at the time of disclosure</li>
  <li>Rightfully obtained without breach of obligation</li>
  <li>Independently developed without reference to the disclosed information</li>
</ul></p>
<p>______________________________________________________</p>

<h2><b>5. Term</b></h2>
<p>This Agreement remains in effect for [1/2/5] years from the date of disclosure.</p>
<p>______________________________________________________</p>

<h2><b>6. Return or Destruction</b></h2>
<p>Upon termination, the Receiving Party shall return or destroy all confidential materials upon request.</p>
<p>______________________________________________________</p>

<h2><b>7. Governing Law</b></h2>
<p>This Agreement shall be governed by and construed in accordance with the laws of [State/Country].</p>
<p>______________________________________________________</p>

<h2><b>Signatures</b></h2>
<p><strong>Disclosing Party:</strong> ____________________  Date: ___________</p>
<p><strong>Receiving Party:</strong> ____________________  Date: ___________</p>
`,
  },
  {
    id: "weekly-report",
    name: "Weekly Report",
    description: "Weekly progress report template",
    icon: FileSpreadsheet,
    categories: ["all", "work"],
    status: "Free",
    content: `<h1>Weekly Report</h1>
<p><strong>Employee Name:</strong> Your Name</p>
<p><strong>Department:</strong> [Team or Department]</p>
<p><strong>Week Ending:</strong> [MM/DD/YYYY]</p>
<p>______________________________________________________</p>

<h2><b>1. Summary</b></h2>
<p>This week focused on completing key deliverables in [project name or sprint name], resolving outstanding issues from the previous cycle, and planning ahead for next week’s goals. Significant progress was made in [brief area of improvement or milestone].</p>
<p>______________________________________________________</p>

<h2><b>2. Completed Tasks</b></h2>
<ul>
  <li>Finalized and submitted [report/module/code feature].</li>
  <li>Conducted 2 client meetings and documented outcomes.</li>
  <li>Fixed [X] bugs and improved performance by [X]% in [specific area].</li>
  <li>Collaborated with design team to complete user flow for [feature].</li>
</ul>
<p>______________________________________________________</p>

<h2><b>3. In-Progress Tasks</b></h2>
<ul>
  <li>Working on the integration of [API/feature], targeting completion by [date].</li>
  <li>Ongoing user testing for [module/feature] — collecting feedback and iterating.</li>
  <li>Writing documentation for [tool/process].</li>
</ul>
<p>______________________________________________________</p>

<h2><b>4. Upcoming Priorities</b></h2>
<ul>
  <li>Launch internal beta of [project name] by [date].</li>
  <li>Refactor [legacy module/codebase] for scalability.</li>
  <li>Conduct team retrospective and planning session.</li>
</ul>
<p>______________________________________________________</p>

<h2><b>5. Challenges</b></h2>
<ul>
  <li>Encountered delays due to [dependency/resource issue]. Mitigated by [solution or workaround].</li>
  <li>Need clarification on [requirement or design aspect] from [stakeholder/lead].</li>
</ul>
<p>______________________________________________________</p>

<h2><b>6. Insights & Learnings</b></h2>
<p>This week’s testing revealed that [X approach] performed significantly better than [Y]. Documented all insights and plan to share during next sync. Gained hands-on experience with [new tool or framework].</p>
<p>______________________________________________________</p>

<h2><b>7. Notes & Support Requests</b></h2>
<ul>
  <li>Requesting access to [tool/resource].</li>
  <li>Would benefit from feedback on [prototype/document].</li>
  <li>Propose additional time for [task/feature] to ensure quality.</li>
</ul>
`,
  },
  {
    id: "research-paper",
    name: "Research Paper",
    description: "Academic research paper format",
    icon: GraduationCap,
    categories: ["all", "education"],
    status: "Pro",
    content: `<h1>Research Paper Title</h1>
<p><strong>Author:</strong> Your Name</p>
<p><strong>Institution:</strong> University / Organization</p>
<p><strong>Date:</strong> [MM/DD/YYYY]</p>
<p>______________________________________________________</p>

<h2><b>Abstract</b></h2>
<p>This paper explores [core topic], focusing on [key issues or goals]. Through a combination of [methods], we aim to demonstrate [primary hypothesis or insight]. Our findings reveal [brief conclusion].</p>

<h2><b>1. Introduction</b></h2>
<p>In recent years, [context or background]. This paper investigates [central question] and its implications in [field/domain].</p>

<h2><b>2. Literature Review</b></h2>
<p>Previous work by [Author, Year] showed [finding]. However, gaps remain in [specific area]. This paper builds upon and challenges these findings by [your approach].</p>

<h2><b>3. Methodology</b></h2>
<p>We conducted [qualitative/quantitative/mixed methods] research involving [participants/sample/technology]. Data was collected using [tools, surveys, experiments] and analyzed using [framework or software].</p>

<h2><b>4. Results</b></h2>
<p>Key outcomes include [data/statistics]. Trends indicate [key pattern or shift]. Tables and graphs included in Appendix A.</p>

<h2><b>5. Discussion</b></h2>
<p>The results support [hypothesis or theory]. However, limitations such as [bias, sample size] may affect generalizability. This opens pathways for future research in [related area].</p>

<h2><b>6. Conclusion</b></h2>
<p>We conclude that [summary of findings]. The implications for [industry/society] are significant and warrant further exploration.</p>
<p>______________________________________________________</p>

<h2><b>References</b></h2>
<ul>
  <li>Smith, J. (2022). <i>Title of Paper</i>. Journal of Research.</li>
  <li>Doe, A. (2021). <i>Another Paper</i>. Science Journal.</li>
</ul>
`,
  },
  {
    id: "study-notes",
    name: "Study Notes",
    description: "Organized study notes template",
    icon: FileCode,
    categories: ["all", "education"],
    status: "Free",
    content: `<h1>Study Notes</h1>
<p><strong>Subject:</strong> [Course Name]</p>
<p><strong>Topic:</strong> [Lecture Topic / Chapter Title]</p>
<p><strong>Date:</strong> [MM/DD/YYYY]</p>
<p><strong>Student:</strong> Your Name</p>
<p>______________________________________________________</p>

<h2><b>Key Concepts</b></h2>
<ul>
  <li><strong>Concept 1:</strong> Definition and example.</li>
  <li><strong>Concept 2:</strong> Explanation with diagram/chart.</li>
  <li><strong>Concept 3:</strong> Real-world application or case study.</li>
  <li><strong>Concept 4:</strong> Definition and example.</li>
  <li><strong>Concept 5:</strong> Explanation with diagram/chart.</li>
  <li><strong>Concept 6:</strong> Real-world application or case study.</li>
</ul>
<p>______________________________________________________</p>

<h2><b>Important Definitions</b></h2>
<ul>
  <li><strong>Term 1:</strong> Short, clear definition.</li>
  <li><strong>Term 2:</strong> Description with context.</li>
</ul>
<p>______________________________________________________</p>

<h2><b>Formulas / Equations</b></h2>
<p><strong>Formula 1:</strong> [Insert formula with variables defined]</p>
<p><strong>Formula 2:</strong> [Insert second formula and how it's used]</p>
<p><strong>Formula 3:</strong> [Insert third formula and how it's used]</p>
<p><strong>Formula 4:</strong> [Insert four formula and how it's used]</p>
<p><strong>Formula 5:</strong> [Insert five formula and how it's used]</p>
<p><strong>Formula 6:</strong> [Insert six formula and how it's used]</p>
<p>______________________________________________________</p>

<h2><b>Diagrams / Charts</b></h2>
<p>[Insert placeholder image or note: "Refer to diagram on page X of textbook"]</p>
<p>______________________________________________________</p>

<h2><b>Summary</b></h2>
<p>This topic covers the fundamentals of [concept]. The most important takeaway is [main insight]. In the exam, likely focus areas include [key sections].</p>
<p>______________________________________________________</p>

<h2><b>Sample Questions</b></h2>
<ol>
  <li>Explain [concept] with an example.</li>
  <li>Compare and contrast [term A] and [term B].</li>
  <li>Solve [problem involving a formula or method].</li>
  <li>Explain [concept] with an example.</li>
  <li>Compare and contrast [term A] and [term B].</li>
  <li>Solve [problem involving a formula or method].</li>
</ol>
`,
  },
  {
    id: "team-directory",
    name: "Team Directory",
    description: "Organize team members and contacts",
    icon: Users,
    categories: ["all", "work"],
    status: "Pro",
    content: `<h1>Team Directory</h1>
<p><strong>Organization / Project:</strong> [Company or Project Name]</p>
<p><strong>Last Updated:</strong> [MM/DD/YYYY]</p>
<p>______________________________________________________</p>

<h2><b>Leadership</b></h2>
<ul>
  <li><strong>Name:</strong> Alice Johnson – CEO<br><strong>Email:</strong> alice@example.com<br><strong>Location:</strong> San Francisco, CA</li>
  <li><strong>Name:</strong> Mark Davis – CTO<br><strong>Email:</strong> mark@example.com<br><strong>Location:</strong> New York, NY</li>
</ul>
<p>______________________________________________________</p>

<h2><b>Engineering Team</b></h2>
<ul>
  <li><strong>Name:</strong> Kevin Smith – Full-Stack Engineer<br><strong>Email:</strong> kevin@example.com<br><strong>Skills:</strong> React, Node.js, Firebase</li>
  <li><strong>Name:</strong> Sara Lee – DevOps Engineer<br><strong>Email:</strong> sara@example.com<br><strong>Skills:</strong> Docker, AWS, Terraform</li>
</ul>
<p>______________________________________________________</p>

<h2><b>Design Team</b></h2>
<ul>
  <li><strong>Name:</strong> Natalie Chen – UX Designer<br><strong>Email:</strong> natalie@example.com<br><strong>Tools:</strong> Figma, Adobe XD, FigJam</li>
</ul>
<p>______________________________________________________</p>

<h2><b>Support</b></h2>
<ul>
  <li><strong>Name:</strong> James Patel – Customer Success<br><strong>Email:</strong> james@example.com<br><strong>Time zone:</strong> GMT+1</li>
</ul>
`,
  },
];
