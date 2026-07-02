import React from 'react';
import { resumeData } from '../../data/resume';
import { FORTUNES } from '../../data/fortunes';
import type { Theme } from '../../context/ThemeContext';

export interface CommandContext {
    theme: Theme;
    cycleTheme: () => void;
    clear: () => void;
    triggerMatrix: () => void;
}

export type CommandOutput = React.ReactNode;
export type CommandHandler = (args: string[], ctx: CommandContext) => CommandOutput;

type Category = 'Navigation' | 'Resources' | 'Terminal';

interface CommandDef {
    name: string;
    description: string;
    category?: Category;
    hidden?: boolean;
    handler: CommandHandler;
}

const CATEGORY_ORDER: Category[] = ['Navigation', 'Resources', 'Terminal'];

const slug = (title: string) => title.toLowerCase().replace(/\s+/g, '_');

const openUrl = (url?: string) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
};

export const OPEN_TARGETS: string[] = [
    ...resumeData.projects.map(p => slug(p.title)),
    'github',
    'linkedin',
];

const resolveProjectUrl = (arg: string): { url?: string; title?: string } => {
    const byIndex = resumeData.projects[Number(arg) - 1];
    if (byIndex) return { url: byIndex.link ?? byIndex.github, title: byIndex.title };
    const bySlug = resumeData.projects.find(p => slug(p.title) === arg.toLowerCase());
    if (bySlug) return { url: bySlug.link ?? bySlug.github, title: bySlug.title };
    return {};
};

const OpeningLink: React.FC<{ label: string; url?: string }> = ({ label, url }) => {
    const [redirecting, setRedirecting] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setRedirecting(true);
            openUrl(url);
        }, 260);
        return () => clearTimeout(timer);
    }, [url]);

    return React.createElement('div', { className: 'out-block' },
        React.createElement('p', null, `Opening ${label}...`),
        redirecting && React.createElement('p', { className: 'out-muted' }, 'Redirecting...')
    );
};

const opening = (label: string, url?: string) => React.createElement(OpeningLink, { label, url });

const aboutOutput = () =>
    React.createElement('div', { className: 'out-block' },
        React.createElement('p', null, `Hi! I'm ${resumeData.name}.`),
        React.createElement('p', null, resumeData.hero.bio),
        React.createElement('p', { className: 'out-muted' }, `Location: ${resumeData.location}`)
    );

const contactOutput = () =>
    React.createElement('div', { className: 'out-block' },
        React.createElement('p', null, `Email: ${resumeData.contact.email}`),
        React.createElement('p', null, `Phone: ${resumeData.contact.phone}`),
        React.createElement('p', null, `LinkedIn: ${resumeData.contact.linkedin}`),
        React.createElement('p', null, `GitHub: ${resumeData.contact.github}`),
        React.createElement('p', { className: 'out-hint' }, 'Type: open github  |  open linkedin')
    );

const VIRTUAL_FILES: Record<string, () => CommandOutput> = {
    'about.md': aboutOutput,
    'contact.md': contactOutput,
    'resume.pdf': () => opening('resume', resumeData.contact.cv),
};

const LS_ENTRIES = ['about.md', 'projects/', 'experience/', 'resume.pdf', 'contact.md', 'blog/'];

const resolveVirtualFile = (name: string): (() => CommandOutput) | undefined => {
    if (VIRTUAL_FILES[name]) return VIRTUAL_FILES[name];
    const basenameMatch = Object.keys(VIRTUAL_FILES).find(k => k.replace(/\.[^.]+$/, '') === name);
    return basenameMatch ? VIRTUAL_FILES[basenameMatch] : undefined;
};

const SudoHire: React.FC = () => {
    const [stage, setStage] = React.useState(0);

    React.useEffect(() => {
        const timers = [
            setTimeout(() => setStage(1), 400),
            setTimeout(() => setStage(2), 900),
            setTimeout(() => setStage(3), 1300),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    return React.createElement('div', { className: 'out-block' },
        React.createElement('p', null, '[sudo] password for recruiter:'),
        stage >= 1 && React.createElement('p', null, '********'),
        stage >= 2 && React.createElement('p', { className: 'out-title' }, 'Access Granted.'),
        stage >= 3 && React.createElement('div', { className: 'out-block' },
            React.createElement('p', null, 'Opening contact information...'),
            contactOutput()
        )
    );
};

export const COMMANDS: CommandDef[] = [
    {
        name: 'about',
        description: 'About me',
        category: 'Navigation',
        handler: aboutOutput,
    },
    {
        name: 'skills',
        description: 'Technologies',
        category: 'Navigation',
        handler: () =>
            React.createElement('div', { className: 'out-block' },
                Object.entries(resumeData.skills).map(([category, items]) =>
                    React.createElement('div', { className: 'out-skill-group', key: category },
                        React.createElement('p', { className: 'out-title' }, category.replace(/_/g, ' ')),
                        (items as string[]).map(item =>
                            React.createElement('p', { className: 'out-check', key: item }, `✔ ${item}`)
                        )
                    )
                )
            ),
    },
    {
        name: 'projects',
        description: 'Featured projects',
        category: 'Navigation',
        handler: () =>
            React.createElement('div', { className: 'out-block' },
                resumeData.projects.map((p, i) =>
                    React.createElement('div', { className: 'out-project', key: p.title },
                        React.createElement('p', { className: 'out-title' }, `[${i + 1}] ${p.title}`),
                        React.createElement('p', { className: 'out-muted' }, p.subtitle),
                        React.createElement('p', { className: 'out-muted' }, p.tech.join(' • '))
                    )
                ),
                React.createElement('p', { className: 'out-hint' }, 'Type: open <n>  e.g. open 1')
            ),
    },
    {
        name: 'experience',
        description: 'Work experience',
        category: 'Navigation',
        handler: () =>
            React.createElement('div', { className: 'out-block' },
                resumeData.experience.map((exp, i) =>
                    React.createElement('div', { className: 'out-exp', key: i },
                        React.createElement('p', { className: 'out-title' }, `${exp.role} @ ${exp.company}`),
                        React.createElement('p', { className: 'out-muted' }, exp.year),
                        exp.description.map((d, j) =>
                            React.createElement('p', { className: 'out-desc-line', key: j }, `- ${d}`)
                        )
                    )
                )
            ),
    },
    {
        name: 'resume',
        description: 'Download resume',
        category: 'Resources',
        handler: () => opening('resume', resumeData.contact.cv),
    },
    {
        name: 'github',
        description: 'Open GitHub',
        category: 'Resources',
        handler: () => opening('GitHub', resumeData.contact.github),
    },
    {
        name: 'linkedin',
        description: 'Open LinkedIn',
        category: 'Resources',
        handler: () => opening('LinkedIn', resumeData.contact.linkedin),
    },
    {
        name: 'contact',
        description: 'Contact information',
        category: 'Resources',
        handler: contactOutput,
    },
    {
        name: 'open',
        description: 'Open a project, github or linkedin',
        category: 'Resources',
        handler: (args) => {
            const target = args[0];
            if (!target) return React.createElement('p', { className: 'out-error' }, 'Usage: open <n|github|linkedin>');
            if (target === 'github') return opening('GitHub', resumeData.contact.github);
            if (target === 'linkedin') return opening('LinkedIn', resumeData.contact.linkedin);
            const { url, title } = resolveProjectUrl(target);
            if (!url) return React.createElement('p', { className: 'out-error' }, `No project found for "${target}"`);
            return opening(title ?? target, url);
        },
    },
    {
        name: 'help',
        description: 'Show commands',
        category: 'Terminal',
        handler: () =>
            React.createElement('div', { className: 'out-help' },
                React.createElement('p', { className: 'out-title' }, 'Available Commands'),
                CATEGORY_ORDER.map(category => {
                    const cmds = COMMANDS.filter(c => !c.hidden && c.category === category);
                    if (!cmds.length) return null;
                    return React.createElement('div', { className: 'out-help-section', key: category },
                        React.createElement('p', { className: 'out-section-title' }, category),
                        cmds.map(c =>
                            React.createElement('div', { className: 'out-row', key: c.name },
                                React.createElement('span', { className: 'out-cmd' }, c.name),
                                React.createElement('span', { className: 'out-desc' }, c.description)
                            )
                        )
                    );
                })
            ),
    },
    {
        name: 'theme',
        description: 'Change terminal theme',
        category: 'Terminal',
        handler: (_args, ctx) => {
            ctx.cycleTheme();
            return React.createElement('p', null, 'Switching theme...');
        },
    },
    {
        name: 'clear',
        description: 'Clear terminal',
        category: 'Terminal',
        handler: (_args, ctx) => { ctx.clear(); return null; },
    },
    {
        name: 'whoami',
        description: 'Hidden command',
        hidden: true,
        handler: () => React.createElement('p', null, 'guest // curious human probably scouting for a hire'),
    },
    {
        name: 'coffee',
        description: 'Hidden command',
        hidden: true,
        handler: () => React.createElement('p', null, '☕ brewing... here you go.'),
    },
    {
        name: 'matrix',
        description: 'Hidden command',
        hidden: true,
        handler: (_args, ctx) => {
            ctx.triggerMatrix();
            return React.createElement('p', null, 'Wake up, Neo...');
        },
    },
    {
        name: 'exit',
        description: 'Hidden command',
        hidden: true,
        handler: () =>
            React.createElement('div', { className: 'out-block' },
                React.createElement('p', null, 'Nice try.'),
                React.createElement('p', null, "This portfolio isn't going anywhere 😄")
            ),
    },
    {
        name: 'fortune',
        description: 'Hidden command',
        hidden: true,
        handler: () => {
            const pick = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
            return React.createElement('div', { className: 'out-block' },
                React.createElement('p', null, 'Random developer quote:'),
                React.createElement('p', { className: 'out-title' }, `"${pick.quote}"`),
                React.createElement('p', { className: 'out-muted' }, `— ${pick.author}`)
            );
        },
    },
    {
        name: 'ls',
        description: 'Hidden command',
        hidden: true,
        handler: () =>
            React.createElement('div', { className: 'out-block' },
                LS_ENTRIES.map(entry => React.createElement('p', { key: entry }, entry))
            ),
    },
    {
        name: 'cat',
        description: 'Hidden command',
        hidden: true,
        handler: (args) => {
            const file = args[0];
            if (!file) return React.createElement('p', { className: 'out-error' }, 'Usage: cat <file>');
            const contentFn = resolveVirtualFile(file);
            if (!contentFn) return React.createElement('p', { className: 'out-error' }, `cat: ${file}: No such file or directory`);
            return contentFn();
        },
    },
    {
        name: 'pwd',
        description: 'Hidden command',
        hidden: true,
        handler: () => React.createElement('p', null, '/home/rahul'),
    },
    {
        name: 'neofetch',
        description: 'Hidden command',
        hidden: true,
        handler: () =>
            React.createElement('div', { className: 'out-neofetch' },
                React.createElement('pre', { className: 'out-ascii' },
                    '        #####\n     ###########\n   ######  ######\n  ####        ####'
                ),
                React.createElement('div', { className: 'out-block' },
                    React.createElement('p', { className: 'out-title' }, 'Rahul AP v2.1'),
                    React.createElement('p', null, `Role: ${resumeData.experience[0].role}`),
                    React.createElement('p', null, `Experience: ${resumeData.hero.exp}+ Years`),
                    React.createElement('p', null, `Frontend: ${resumeData.skills.frontend.slice(0, 3).join(', ')}`),
                    React.createElement('p', null, `Backend: ${resumeData.skills.backend.slice(0, 3).join(', ')}`),
                    React.createElement('p', null, `AI: ${resumeData.skills.ai.slice(0, 3).join(', ')}`),
                    React.createElement('p', null, `Location: ${resumeData.location}`)
                )
            ),
    },
    {
        name: 'blog',
        description: 'Hidden command',
        hidden: true,
        handler: () => React.createElement('p', { className: 'out-muted' }, 'blog: under construction — check back soon.'),
    },
];

export function runCommand(input: string, ctx: CommandContext): CommandOutput {
    const [name, ...args] = input.trim().split(/\s+/);
    if (!name) return null;

    if (name === 'sudo' && args.join(' ') === 'hire rahul') {
        return React.createElement(SudoHire);
    }

    const cmd = COMMANDS.find(c => c.name === name.toLowerCase());
    if (!cmd) {
        const fileFn = resolveVirtualFile(name.toLowerCase());
        if (fileFn) return fileFn();
        return React.createElement('p', { className: 'out-error' },
            `command not found: ${name}. Type "help" for a list of commands.`);
    }
    return cmd.handler(args, ctx);
}

export const COMMAND_NAMES = COMMANDS.map(c => c.name);
