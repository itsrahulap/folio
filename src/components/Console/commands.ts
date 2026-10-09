import React from 'react';
import { resumeData } from '../../data/resume';
import { THEME_ORDER, type Theme } from '../../context/ThemeContext';

export interface CommandContext {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    close: () => void;
    goto: (id: string) => void;
}

export type CommandOutput = React.ReactNode;
type Category = 'Portfolio' | 'Links' | 'Console';

interface CommandDef {
    name: string;
    usage?: string;
    aliases?: string[];
    description: string;
    category: Category;
    handler: (args: string[], ctx: CommandContext) => CommandOutput;
}

const h = React.createElement;
const slug = (title: string) => title.toLowerCase().replace(/\s+/g, '_');
const err = (msg: string) => h('p', { className: 'out-error' }, msg);

const open = (label: string, url?: string) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
    return h('p', { className: 'out-muted' }, `Opening ${label} in a new tab.`);
};

const LINKS: Record<string, [string, string]> = {
    github: ['GitHub', resumeData.contact.github],
    linkedin: ['LinkedIn', resumeData.contact.linkedin],
    resume: ['resume', resumeData.contact.cv],
};

export const GOTO_TARGETS = ['work', 'system', 'journey', 'contact', 'top'];

const about = () =>
    h('div', { className: 'out-block' },
        h('p', { className: 'out-title' }, resumeData.name),
        h('p', null, resumeData.hero.bio),
        h('p', { className: 'out-muted' }, resumeData.location)
    );

const contact = () =>
    h('div', { className: 'out-block' },
        h('p', null, `email     ${resumeData.contact.email}`),
        h('p', null, `phone     ${resumeData.contact.phone}`),
        h('p', null, `linkedin  ${resumeData.contact.linkedin}`),
        h('p', null, `github    ${resumeData.contact.github}`),
        h('p', { className: 'out-hint' }, 'open github · open linkedin · goto contact')
    );

const skills = () =>
    h('div', { className: 'out-block' },
        Object.entries(resumeData.skills).map(([group, items]) =>
            h('div', { className: 'out-group', key: group },
                h('p', { className: 'out-title' }, group.replace(/_/g, ' ')),
                h('p', null, (items as string[]).join(' · '))
            )
        )
    );

const projects = () =>
    h('div', { className: 'out-block' },
        resumeData.projects.map((p, i) =>
            h('div', { className: 'out-group', key: p.title },
                h('p', { className: 'out-title' }, `${String(i + 1).padStart(2, '0')}  ${p.title}`),
                h('p', null, p.subtitle),
                h('p', { className: 'out-muted' }, p.tech.join(' · '))
            )
        ),
        h('p', { className: 'out-hint' }, 'open <n|name> — e.g. open 1')
    );

const experience = () =>
    h('div', { className: 'out-block' },
        resumeData.experience.map((exp, i) =>
            h('div', { className: 'out-group', key: i },
                h('p', { className: 'out-title' }, `${exp.role} — ${exp.company}`),
                h('p', { className: 'out-muted' }, exp.year),
                exp.description.map((d, j) => h('p', { className: 'out-indent', key: j }, `– ${d}`))
            )
        )
    );

// `ls` / `cat` only expose the same real content as the commands above.
const FILES: Record<string, () => CommandOutput> = {
    'about.txt': about,
    'skills.txt': skills,
    'projects.txt': projects,
    'experience.txt': experience,
    'contact.txt': contact,
};

const resolveProject = (arg: string) =>
    resumeData.projects[Number(arg) - 1] ?? resumeData.projects.find(p => slug(p.title) === arg);

export const COMMANDS: CommandDef[] = [
    { name: 'about', description: 'Who I am', category: 'Portfolio', handler: about },
    { name: 'skills', description: 'Technologies I work with', category: 'Portfolio', handler: skills },
    { name: 'projects', description: 'Selected projects', category: 'Portfolio', handler: projects },
    { name: 'experience', description: 'Where I have worked', category: 'Portfolio', handler: experience },
    { name: 'contact', description: 'How to reach me', category: 'Portfolio', handler: contact },
    {
        name: 'ls', description: 'List the files cat can print', category: 'Portfolio',
        handler: () => h('p', null, Object.keys(FILES).join('   ')),
    },
    {
        name: 'cat', usage: 'cat <file>', description: 'Print one of those files', category: 'Portfolio',
        handler: ([file]) => {
            if (!file) return err('usage: cat <file> — try ls');
            const fn = FILES[file.toLowerCase()] ?? FILES[`${file.toLowerCase()}.txt`];
            return fn ? fn() : err(`cat: ${file}: no such file — try ls`);
        },
    },
    { name: 'resume', description: 'Open my resume', category: 'Links', handler: () => open(...LINKS.resume) },
    { name: 'github', description: 'Open GitHub', category: 'Links', handler: () => open(...LINKS.github) },
    { name: 'linkedin', description: 'Open LinkedIn', category: 'Links', handler: () => open(...LINKS.linkedin) },
    {
        name: 'open', usage: 'open <target>', description: 'Open a project (number or name), github, linkedin or resume',
        category: 'Links',
        handler: ([target]) => {
            if (!target) return err('usage: open <n|name|github|linkedin|resume>');
            const t = target.toLowerCase();
            if (LINKS[t]) return open(...LINKS[t]);
            const p = resolveProject(t);
            const url = p && (p.link ?? p.github);
            return url ? open(p.title, url) : err(`open: nothing called "${target}" — try projects`);
        },
    },
    {
        name: 'goto', usage: 'goto <section>', description: `Close and scroll to ${GOTO_TARGETS.join(' | ')}`,
        category: 'Console',
        handler: ([target], ctx) => {
            const t = target?.toLowerCase();
            if (!t || !GOTO_TARGETS.includes(t)) return err(`usage: goto <${GOTO_TARGETS.join('|')}>`);
            ctx.goto(t);
            return null;
        },
    },
    {
        name: 'theme', usage: 'theme [dark|light]', description: 'Switch or set the colour theme', category: 'Console',
        handler: ([arg], ctx) => {
            const t = arg?.toLowerCase();
            if (t && !THEME_ORDER.includes(t as Theme)) return err(`usage: theme [${THEME_ORDER.join('|')}]`);
            const next = (t as Theme) ?? THEME_ORDER[(THEME_ORDER.indexOf(ctx.theme) + 1) % THEME_ORDER.length];
            ctx.setTheme(next);
            return h('p', { className: 'out-muted' }, `theme: ${next}`);
        },
    },
    { name: 'clear', description: 'Clear the console', category: 'Console', handler: () => null },
    {
        name: 'exit', aliases: ['gui'], description: 'Close the console', category: 'Console',
        handler: (_args, ctx) => { ctx.close(); return null; },
    },
    {
        name: 'help', description: 'This list', category: 'Console',
        handler: () =>
            h('div', { className: 'out-block' },
                (['Portfolio', 'Links', 'Console'] as Category[]).map(cat =>
                    h('div', { className: 'out-group', key: cat },
                        h('p', { className: 'out-title' }, cat),
                        COMMANDS.filter(c => c.category === cat).map(c =>
                            h('div', { className: 'out-row', key: c.name },
                                h('span', { className: 'out-cmd' }, [c.usage ?? c.name, ...(c.aliases ?? [])].join(', ')),
                                h('span', { className: 'out-muted' }, c.description)
                            )
                        )
                    )
                ),
                h('p', { className: 'out-hint' }, 'Tab completes · ↑ ↓ history · Esc closes')
            ),
    },
];

export const COMMAND_NAMES = COMMANDS.flatMap(c => [c.name, ...(c.aliases ?? [])]);

/** Arguments offered for Tab completion / suggestions, by command. */
export const ARG_OPTIONS: Record<string, string[]> = {
    open: [...resumeData.projects.map(p => slug(p.title)), ...Object.keys(LINKS)],
    goto: GOTO_TARGETS,
    theme: THEME_ORDER,
    cat: Object.keys(FILES),
};

export function runCommand(input: string, ctx: CommandContext): CommandOutput {
    const [name, ...args] = input.trim().split(/\s+/);
    const n = name.toLowerCase();
    const cmd = COMMANDS.find(c => c.name === n || c.aliases?.includes(n));
    if (!cmd) return err(`command not found: ${name} — type help`);
    return cmd.handler(args, ctx);
}
