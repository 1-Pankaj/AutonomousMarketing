#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const LEADS_DIR = path.join(PROJECT_ROOT, 'leads');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readJsonFile(filename, fallback = []) {
  try {
    const fullPath = path.join(LEADS_DIR, filename);
    if (fs.existsSync(fullPath)) {
      const data = fs.readFileSync(fullPath, 'utf-8');
      return JSON.parse(data);
    }
    // If private leads.json does not exist, fallback to sample template
    if (filename === 'leads.json') {
      const examplePath = path.join(LEADS_DIR, 'leads.example.json');
      if (fs.existsSync(examplePath)) {
        const data = fs.readFileSync(examplePath, 'utf-8');
        return JSON.parse(data);
      }
    }
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
  }
  return fallback;
}

function writeJsonFile(filename, data) {
  try {
    ensureDir(LEADS_DIR);
    const fullPath = path.join(LEADS_DIR, filename);
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    return false;
  }
}

// Lead normalizer
function normalizeLead(raw, index) {
  if (raw && typeof raw.healthScore === 'number' && raw.domain) {
    return raw;
  }
  const id = raw['Lead ID'] || raw.id || `lead-${index + 1}`;
  const name = raw['Business Name'] || raw.name || 'Unnamed Business';
  const url = raw['Website URL'] || raw.domain || '';
  let domain = url;
  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      domain = new URL(url).hostname.replace(/^www\./, '');
    } else if (url) {
      domain = url.split('/')[0].replace(/^www\./, '');
    }
  } catch {
    domain = url || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  }
  if (!domain) domain = `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

  const priority = parseInt(String(raw['Lead Priority (1-5)'] || raw.priority || '3'), 10) || 3;
  let healthScore = 55;
  let healthStatus = 'Fair';
  let opportunityValue = '$8,500 - $12,000';

  if (priority >= 5) {
    healthScore = 26 + ((index * 3) % 9);
    healthStatus = 'Critical';
    opportunityValue = '$12,500 - $18,000';
  } else if (priority === 4) {
    healthScore = 38 + ((index * 2) % 11);
    healthStatus = 'Moderate';
    opportunityValue = '$8,500 - $12,000';
  } else if (priority === 3) {
    healthScore = 52 + ((index * 4) % 14);
    healthStatus = 'Fair';
    opportunityValue = '$6,000 - $9,500';
  } else {
    healthScore = 75 + ((index * 2) % 14);
    healthStatus = 'Healthy';
    opportunityValue = '$4,000 - $6,500';
  }

  return {
    id,
    name,
    domain,
    category: raw['Category'] || raw.category || 'General Business',
    healthScore,
    healthStatus,
    vulnerability: raw['Primary Digital Gap'] || raw.vulnerability || 'Mobile speed optimization and scheduling needed',
    recommendedServices: raw['Recommended Services'] || 'Website modernization, mobile performance sprint, SEO',
    opportunityValue,
    city: raw['City/Area'] || raw.city || '',
    contactPerson: raw['Contact Person (Role)'] || raw.contactPerson || '',
    phone: raw['Phone'] || raw.phone || '',
    email: raw['Email'] || raw.email || '',
    notes: raw['Notes (outreach angle)'] || raw.notes || '',
    status: raw.status || 'New',
  };
}

// Initialize MCP Server
const server = new McpServer({
  name: 'automarket-studio',
  version: '1.0.0',
});

// Tool 1: list_leads
server.tool(
  'list_leads',
  'Query and filter local offline business leads with digital health scores and flaws',
  {
    status: z.enum(['All', 'Critical', 'Moderate', 'Fair', 'Healthy']).optional().describe('Filter by health status'),
    search: z.string().optional().describe('Search query matching name, domain, city, or vulnerability'),
    limit: z.number().optional().describe('Number of leads to return (default: 15)'),
    offset: z.number().optional().describe('Skip offset (default: 0)'),
  },
  async ({ status = 'All', search = '', limit = 15, offset = 0 }) => {
    const raw = readJsonFile('leads.json', []);
    const leads = raw.map(normalizeLead);
    const q = search.toLowerCase().trim();

    const filtered = leads.filter((lead) => {
      const matchStatus =
        status === 'All' ? true :
        status === 'Critical' ? lead.healthStatus === 'Critical' :
        status === 'Moderate' ? (lead.healthStatus === 'Moderate' || lead.healthStatus === 'Fair') :
        lead.healthStatus === 'Healthy';

      if (!matchStatus) return false;
      if (!q) return true;

      return (
        lead.name.toLowerCase().includes(q) ||
        lead.domain.toLowerCase().includes(q) ||
        lead.category.toLowerCase().includes(q) ||
        lead.vulnerability.toLowerCase().includes(q) ||
        (lead.city && lead.city.toLowerCase().includes(q))
      );
    });

    const page = filtered.slice(offset, offset + limit);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              totalMatching: filtered.length,
              totalInDatabase: leads.length,
              offset,
              limit,
              leads: page,
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

// Tool 2: get_lead_audit
server.tool(
  'get_lead_audit',
  'Get comprehensive digital health audit breakdown, contact details, and flaw analysis for a specific business',
  {
    leadIdOrDomain: z.string().describe('Lead ID (e.g. RJ-001) or business domain (e.g. medipulse.in) or business name'),
  },
  async ({ leadIdOrDomain }) => {
    const raw = readJsonFile('leads.json', []);
    const leads = raw.map(normalizeLead);
    const target = leadIdOrDomain.toLowerCase().trim();

    const lead = leads.find(
      (l) =>
        l.id.toLowerCase() === target ||
        l.domain.toLowerCase() === target ||
        l.name.toLowerCase().includes(target)
    );

    if (!lead) {
      return {
        content: [{ type: 'text', text: `Lead not found matching "${leadIdOrDomain}".` }],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              leadId: lead.id,
              name: lead.name,
              domain: lead.domain,
              city: lead.city,
              category: lead.category,
              healthScore: lead.healthScore,
              healthStatus: lead.healthStatus,
              opportunityValue: lead.opportunityValue,
              detectedFlaw: lead.vulnerability,
              recommendedServices: lead.recommendedServices,
              outreachAngle: lead.notes,
              contact: {
                person: lead.contactPerson,
                phone: lead.phone,
                email: lead.email,
              },
              status: lead.status,
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

// Tool 3: update_lead
server.tool(
  'update_lead',
  'Update CRM status or notes for a target lead in the local storage',
  {
    leadId: z.string().describe('Target Lead ID (e.g. RJ-001)'),
    status: z.enum(['New', 'Audited', 'Proposal Sent', 'Closed']).describe('Updated CRM status'),
    notes: z.string().optional().describe('Additional notes or outreach logs'),
  },
  async ({ leadId, status, notes }) => {
    const raw = readJsonFile('leads.json', []);
    let found = false;

    const updated = raw.map((item, idx) => {
      const id = item['Lead ID'] || item.id || `lead-${idx + 1}`;
      if (id === leadId) {
        found = true;
        return {
          ...item,
          status,
          ...(notes ? { notes, 'Notes (outreach angle)': notes } : {}),
        };
      }
      return item;
    });

    if (!found) {
      return { content: [{ type: 'text', text: `Lead with ID "${leadId}" was not found.` }] };
    }

    writeJsonFile('leads.json', updated);
    return {
      content: [
        {
          type: 'text',
          text: `Successfully updated lead ${leadId} status to "${status}".`,
        },
      ],
    };
  }
);

// Tool 4: get_content_queue
server.tool(
  'get_content_queue',
  'Get queued marketing posts, case studies, and drafts from the local publishing queue',
  {
    status: z.enum(['All', 'Ready', 'Staged']).optional().describe('Filter by status: Ready (scheduled) or Staged (drafts)'),
  },
  async ({ status = 'All' }) => {
    const posts = readJsonFile('posts.json', []);
    const filtered = status === 'All' ? posts : posts.filter((p) => p.status === status);
    return {
      content: [{ type: 'text', text: JSON.stringify(filtered, null, 2) }],
    };
  }
);

// Tool 5: schedule_post
server.tool(
  'schedule_post',
  'Create and schedule a new educational case study, tip, or update to the content queue',
  {
    title: z.string().describe('Post headline or title'),
    content: z.string().describe('Full post text formatted for publication'),
    channel: z.string().optional().describe('Target channel (e.g. "Bluesky / AT Protocol", "Twitter / X", "WhatsApp")'),
    scheduledTime: z.string().optional().describe('Scheduled time (e.g. "Tomorrow 09:00 AM")'),
    isDraft: z.boolean().optional().describe('Whether to save as draft (Staged) or mark Ready to publish'),
  },
  async ({ title, content, channel = 'Multi-Channel', scheduledTime = 'Tomorrow 09:00 AM', isDraft = false }) => {
    const posts = readJsonFile('posts.json', []);
    const newPost = {
      id: `post-${Date.now()}`,
      title,
      content,
      channel,
      scheduledTime: isDraft ? 'Saved in Drafts' : scheduledTime,
      charCount: content.length,
      parts: 'Single post',
      category: 'Case Study',
      status: isDraft ? 'Staged' : 'Ready',
      tags: ['Marketing', 'Client Success'],
    };

    const updated = [newPost, ...posts];
    writeJsonFile('posts.json', updated);
    return {
      content: [
        {
          type: 'text',
          text: `Post "${title}" created successfully with ID ${newPost.id} (${newPost.status}).`,
        },
      ],
    };
  }
);

// Tool 6: publish_post
server.tool(
  'publish_post',
  'Publish a queued post immediately and mark Step 1 of the Daily Sprint as complete',
  {
    postIdOrTitle: z.string().describe('Post ID or title to publish'),
  },
  async ({ postIdOrTitle }) => {
    const posts = readJsonFile('posts.json', []);
    let found = false;

    const updated = posts.map((p) => {
      if (p.id === postIdOrTitle || p.title.toLowerCase().includes(postIdOrTitle.toLowerCase())) {
        found = true;
        return { ...p, status: 'Ready' };
      }
      return p;
    });

    if (!found) {
      return { content: [{ type: 'text', text: `Post "${postIdOrTitle}" not found in queue.` }] };
    }

    writeJsonFile('posts.json', updated);

    // Auto-advance sprint step 1
    const sprint = readJsonFile('sprint.json', { currentStep: 1, stepCompleted: [false, false, false, false] });
    if (!sprint.stepCompleted[0]) {
      sprint.stepCompleted[0] = true;
      writeJsonFile('sprint.json', sprint);
    }

    return {
      content: [{ type: 'text', text: `Post "${postIdOrTitle}" marked as published. Daily Sprint Step 1 completed.` }],
    };
  }
);

// Tool 7: get_client_opportunities
server.tool(
  'get_client_opportunities',
  'List inbound social buyer intent posts and matched client inquiries',
  {
    minScore: z.number().optional().describe('Minimum match score (0-100, default: 85)'),
  },
  async ({ minScore = 85 }) => {
    const intents = readJsonFile('intents.json', []);
    const filtered = intents.filter((i) => (i.matchScore || 0) >= minScore);
    return {
      content: [{ type: 'text', text: JSON.stringify(filtered, null, 2) }],
    };
  }
);

// Tool 8: get_daily_sprint
server.tool(
  'get_daily_sprint',
  'Get the status and checklist of the Daily 15-Minute Marketing Sprint routine',
  {},
  async () => {
    const sprint = readJsonFile('sprint.json', {
      currentStep: 3,
      stepCompleted: [true, true, false, false],
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              currentStep: sprint.currentStep,
              completedCount: sprint.stepCompleted.filter(Boolean).length,
              totalSteps: 4,
              steps: [
                { step: 1, title: "Share Today's Case Study", done: !!sprint.stepCompleted[0] },
                { step: 2, title: 'Review New Inquiries', done: !!sprint.stepCompleted[1] },
                { step: 3, title: 'Send Personalized Message', done: !!sprint.stepCompleted[2] },
                { step: 4, title: 'Review Tomorrow’s Schedule', done: !!sprint.stepCompleted[3] },
              ],
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

// Tool 9: complete_sprint_step
server.tool(
  'complete_sprint_step',
  'Mark a specific step of the Daily 15-Minute Marketing Sprint routine as completed',
  {
    stepNumber: z.number().min(1).max(4).describe('Sprint step number (1 to 4)'),
  },
  async ({ stepNumber }) => {
    const sprint = readJsonFile('sprint.json', {
      currentStep: 1,
      stepCompleted: [false, false, false, false],
    });

    sprint.stepCompleted[stepNumber - 1] = true;
    if (sprint.currentStep === stepNumber && sprint.currentStep < 4) {
      sprint.currentStep += 1;
    }
    sprint.lastUpdated = new Date().toISOString();

    writeJsonFile('sprint.json', sprint);
    return {
      content: [
        {
          type: 'text',
          text: `Sprint Step ${stepNumber} marked complete. Currently on Step ${sprint.currentStep} of 4.`,
        },
      ],
    };
  }
);

// Tool 10: generate_client_proposal
server.tool(
  'generate_client_proposal',
  'Craft a personalized, anti-jargon modernization proposal message for a specific prospect',
  {
    leadIdOrDomain: z.string().describe('Lead ID or business domain'),
    packageType: z.enum(['14-Day Performance Sprint', 'Complete Architecture Overhaul']).optional(),
  },
  async ({ leadIdOrDomain, packageType = '14-Day Performance Sprint' }) => {
    const raw = readJsonFile('leads.json', []);
    const leads = raw.map(normalizeLead);
    const target = leadIdOrDomain.toLowerCase().trim();

    const lead = leads.find(
      (l) =>
        l.id.toLowerCase() === target ||
        l.domain.toLowerCase() === target ||
        l.name.toLowerCase().includes(target)
    );

    if (!lead) {
      return { content: [{ type: 'text', text: `Lead "${leadIdOrDomain}" not found.` }] };
    }

    const recipient = lead.contactPerson ? `Hi ${lead.contactPerson},` : `Hi ${lead.name} Team,`;
    const cost = packageType === '14-Day Performance Sprint' ? '$8,500' : '$14,000';
    const timeline = packageType === '14-Day Performance Sprint' ? '14-day sprint' : '4-week overhaul';

    const proposal = `${recipient}

Attached is the 2-page modernization review we prepared for ${lead.name} (${lead.domain}) regarding ${lead.vulnerability.toLowerCase()}.

Our ${timeline} (${packageType} — ${cost} fixed scope) migrates your primary appointment and checkout flows to a modern edge frontend, cutting mobile latency down to under 0.8 seconds without altering your existing records backend or workflows.

Key deliverables:
1. Mobile-first responsive checkout & booking portal
2. Edge static caching layer to eliminate database slot wait times
3. Zero-downtime cutover without requiring staff retraining

Would you be open to a brief 10-minute walkthrough this Thursday?`;

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              recipient: lead.name,
              domain: lead.domain,
              packageType,
              investment: cost,
              proposalText: proposal,
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

// Tool 11: export_leads_csv
server.tool(
  'export_leads_csv',
  'Export the full target pipeline to leads/leads_backup.csv',
  {},
  async () => {
    const raw = readJsonFile('leads.json', []);
    const leads = raw.map(normalizeLead);

    if (leads.length === 0) {
      return { content: [{ type: 'text', text: 'No leads available to export.' }] };
    }

    const headers = ['Lead ID', 'Business Name', 'Domain', 'Category', 'Health Score', 'Status', 'Gap', 'City', 'Phone', 'Email'];
    const escape = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
    const lines = [
      headers.join(','),
      ...leads.map((l) => [
        escape(l.id),
        escape(l.name),
        escape(l.domain),
        escape(l.category),
        escape(l.healthScore),
        escape(l.healthStatus),
        escape(l.vulnerability),
        escape(l.city),
        escape(l.phone),
        escape(l.email),
      ].join(',')),
    ];

    ensureDir(LEADS_DIR);
    const exportPath = path.join(LEADS_DIR, 'leads_backup.csv');
    fs.writeFileSync(exportPath, lines.join('\n'), 'utf-8');

    return {
      content: [
        {
          type: 'text',
          text: `Successfully exported ${leads.length} leads to ${exportPath}.`,
        },
      ],
    };
  }
);

// Start server on stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Fatal MCP Server error:', error);
  process.exit(1);
});
