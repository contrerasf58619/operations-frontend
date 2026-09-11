# Storybook Patterns — Operations Frontend

Audit of the repo's existing Storybook conventions, and what it takes to apply them to the
OTP / 2FA components on `nf_1_dc`.

Discovery date: 2026-09-02 · Branch: `nf_1_dc`

---

## 0. Report-back summary

| Question | Answer |
| --- | --- |
| Storybook version | **10.4.0** installed (`^10.3.4` in `package.json`) |
| Framework / builder | `@storybook/nextjs` → **webpack5** builder (not Vite) |
| Existing stories | **5 files, 10 story exports**, all under `src/stories/` |
| Primary decorator pattern | **None.** No global decorators, no story decorators, no providers, no MSW, no `argTypes`, no `play` functions, no `__mocks__/` |
| Ready to write OTP stories? | **Partly.** `CodeCard` can be storied today with zero changes. The other six components import `src/api/otp.api.ts`, which **throws at import time in Storybook** — one `.storybook/main.ts` change (Section D) unblocks them. |

---

## Section A — Storybook configuration & setup

### Files

`.storybook/main.ts` (current, verbatim):

```ts
import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-docs'],
    framework: '@storybook/nextjs',
    staticDirs: ['../public'],
}

export default config
```

`.storybook/preview.ts` (current, verbatim):

```ts
import type { Preview } from '@storybook/nextjs-vite'

import '../src/app/globals.css'

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },

        a11y: {
            test: 'todo',
        },
    },
}

export default preview
```

### Facts

- **Addons installed:** `@storybook/addon-docs` only. `backgrounds`, `controls`, `viewport` and
  `actions` are built into Storybook 10 core, so those parameters work without an addon entry.
- **Global decorators:** none. Nothing wraps a story — no theme, no router, no context provider.
- **Styling:** Tailwind CSS v4, loaded by `preview.ts` importing `src/app/globals.css`
  (that file is a single line: `@import 'tailwindcss';`).
- **Mock strategy:** none exists. See Section C.
- **`play` functions / interaction tests:** none written, but `storybook/test` and
  `storybook/actions` ship with the `storybook` package and are importable with **zero new
  dependencies** (verified in `node_modules/storybook/package.json` exports). A `play` function
  will execute; the step-by-step Interactions panel needs `@storybook/addon-vitest`, which is not
  installed.
- **`@/*` path alias works in Storybook** — verified by building a probe story that imported
  `@/api/otp.api`. The five existing stories nonetheless use relative imports
  (`../components/UI/...`). Either resolves; match the neighbours and use relative paths.

### Four config observations worth knowing (not blockers)

1. **`preview.ts` imports its type from the wrong package.**
   `import type { Preview } from '@storybook/nextjs-vite'` — that package is **not installed**
   (only `@storybook/nextjs` is). It is a type-only import so the build still succeeds, but the
   type does not resolve in the editor. Should be `@storybook/nextjs`.
2. **The `a11y` parameter is inert.** `@storybook/addon-a11y` is not installed, so
   `a11y: { test: 'todo' }` does nothing today.
3. **`tailwind.config.ts` is never loaded.** Tailwind v4 only reads a legacy config when the CSS
   has an explicit `@config` directive, and `globals.css` has none. So the custom colors defined
   there (`charcoal`, `graphite`, `amber`, `cyan`, `teal`, `orange`, …) do not produce utilities —
   in the app *or* in Storybook. This is why `Filters.stories.tsx` gets its dark surface from an
   arbitrary value (`bg-[#0b0c0e]`) plus a `backgrounds` parameter rather than `bg-charcoal`.
   Consequence for OTP: every OTP component styles itself with **core** Tailwind palette classes
   (`gray-*`, `indigo-*`, `emerald-*`, `red-*`, `amber-400`), so all of them render correctly.
4. **`dark:` follows the OS/browser theme.** No custom dark variant is defined, so Tailwind v4's
   default `prefers-color-scheme` applies. Every OTP component is heavily `dark:`-styled, but a
   story **cannot toggle light/dark** without adding a variant. See Section I, open question 3.

---

## Section B — The house story template

All five existing stories follow one shape. This is it, generalised:

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs'

import { ComponentName } from '../components/UI/ComponentName'

// --- Sample data ---
const sampleThings: Thing[] = [
    { id: 1, name: 'Carlos García' },
    { id: 2, name: 'María López' },
]

const meta = {
    title: 'Components/ComponentName',
    component: ComponentName,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Descripción del componente en español, una o dos frases.',
            },
        },
    },
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        things: sampleThings,
        onChange: () => {},
    },
}
```

### The conventions this encodes

| Convention | Value |
| --- | --- |
| Type import | `import type { Meta, StoryObj } from '@storybook/nextjs'` (never `@storybook/react`) |
| Meta declaration | `const meta = { … } satisfies Meta<typeof X>` then `export default meta` |
| Story type alias | `type Story = StoryObj<typeof meta>` — declared once, right after the default export |
| `tags` | `['autodocs']` on **every** meta |
| `title` | `Components/<ComponentName>` — flat, one level deep, always |
| `parameters.layout` | `'padded'` on every story so far |
| `parameters.docs.description.component` | Always present, always **Spanish** prose |
| Sample data | Module-level consts under a `// --- Sample data ---` banner comment, Spanish names |
| `argTypes` | **Never used.** Controls are inferred from TS props by react-docgen |
| `decorators` | **Never used** |
| `play` | **Never used** |
| Formatting | Prettier: 4-space indent, single quotes, `jsxSingleQuote`, no semicolons, `arrowParens: avoid`, `printWidth: 100`, trailing commas |

---

## Section C — Mock patterns used in the repo

**There is no mocking infrastructure.** No `msw`, no `msw-storybook-addon`, no `jest.mock`, no
`__mocks__/` directories, no module aliasing in `main.ts`. This is less an oversight than a
consequence of *what* has been storied: every storied component so far
(`Autocomplete`, `DataTable`, `Tabs`, `PayrollPeriodSelector`, `Filters`) is a **pure
presentational component** — no `'use client'`, no context, no API module, no cookies. Nothing
needed mocking.

Three techniques *are* in use, and they cover most of what OTP needs:

### Pattern 1 — Static sample data as module consts

```tsx
// --- Sample data ---
const samplePayrollPeriods: PayrollPeriod[] = [
    { date_from: '2026-03-01', date_to: '2026-03-15' },
    { date_from: '2026-03-16', date_to: '2026-03-31' },
]
```

### Pattern 2 — Callbacks stubbed inline in `args`

```tsx
// Autocomplete, Tabs, Filters
args: { onChange: () => {} }

// PayrollPeriodSelector
args: { onChange: (period: PayrollPeriod) => console.log('Selected:', period) }
```

> `fn()` from `storybook/test` would be strictly better here (spy + Actions panel logging), and it
> needs no new dependency. The repo just predates its use.

### Pattern 3 — Stateful `render`, two variants

**3a — inline `render` that owns state** (`Autocomplete.stories.tsx`, `Tabs.stories.tsx`):

```tsx
export const Default: Story = {
    args: { onChange: () => {}, options: sampleOptions, value: null },
    render: function Render(args) {
        const [value, setValue] = useState<string | number | null>(args.value)
        return (
            <div style={{ maxWidth: 320 }}>
                <Autocomplete
                    {...args}
                    value={value}
                    onChange={val => setValue(val === '' ? null : val)}
                />
            </div>
        )
    },
}
```

The named `function Render(...)` form (not an arrow) is deliberate — it lets the story call hooks
without tripping the rules-of-hooks lint.

**3b — a local "harness" component reused by several stories** (`Filters.stories.tsx`):

```tsx
function FiltersHarness({ initialFilters = [], maxFilters, fields = sampleFields }) {
    const [filters, setFilters] = useState<Filter[]>(initialFilters)
    return (
        <div className='min-h-[420px] rounded-lg bg-[#0b0c0e] p-6'>
            <Filters
                fields={fields}
                filters={filters}
                onChange={setFilters}
                maxFilters={maxFilters}
            />
            {/* live state readout for the docs page */}
            <pre>{JSON.stringify(filters, null, 2)}</pre>
        </div>
    )
}

export const WithActiveFilters: Story = {
    args: { fields: sampleFields, filters: [], onChange: () => {} },
    render: function Render() {
        return <FiltersHarness initialFilters={[createFilter('status', 'is', ['open'])]} />
    },
}
```

`Filters.stories.tsx` is the closest thing to a multi-state reference: six stories off one harness.
It is the file to imitate for the OTP modals.

**Context mocking: no example exists in the repo.** Section G proposes one.

---

## Section D — The blocker: `otp.api.ts` throws on import in Storybook

This is the one thing that must be fixed before six of the seven OTP components can be storied.

### What happens

`src/api/otp.api.ts` follows the repo-wide fail-fast convention:

```ts
const api = process.env.NEXT_PUBLIC_URL_WORKFORCE

if (!api) {
    throw new Error('Please define NEXT_PUBLIC_URL_WORKFORCE in your .env file')
}
```

Storybook's webpack build does **not** inject `NEXT_PUBLIC_*` variables. Storybook core's
`loadEnvs` only exposes variables matching `/^STORYBOOK_/` plus `NODE_ENV`, and
`@storybook/nextjs` v10 adds no `NEXT_PUBLIC_` handling of its own (no occurrence of
`NEXT_PUBLIC` or `loadEnvConfig` anywhere in its `dist/`).

**Verified empirically.** A throwaway probe story importing `@/api/otp.api` was compiled with
`npx storybook build`; the emitted bundle contains:

```js
api = { NODE_ENV: "production", NODE_PATH: [], STORYBOOK: "true", PUBLIC_URL: "." }
        .NEXT_PUBLIC_URL_WORKFORCE;
if (!api) throw new Error("Please define NEXT_PUBLIC_URL_WORKFORCE in your .env file")
```

webpack replaced the whole `process.env` object with a four-key literal.
`.NEXT_PUBLIC_URL_WORKFORCE` is `undefined`, so the module throws the moment it is imported and the
story never renders. `.env.development` / `.env.qa` / `.env.production` all define the variable,
but Storybook never reads them.

### The fix — add `env` to `.storybook/main.ts`

```ts
import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
    stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
    addons: ['@storybook/addon-docs'],
    framework: '@storybook/nextjs',
    staticDirs: ['../public'],
    env: config => ({
        ...config,
        NEXT_PUBLIC_URL_WORKFORCE: 'https://storybook.mock/',
    }),
}

export default config
```

`env` is a supported `StorybookConfig` field in Storybook 10
(`env?: PresetValue<Record<string, string>>`). A fake URL is the right value: stories should never
reach a real backend, and Section G's adapter intercepts the requests anyway.

**This fix is verified, not assumed.** Rebuilding the same probe with the `env` field above
produced a bundle where the value is inlined and the guard is dead-code-eliminated:

```js
PROBE_ENV_VALUE=${String("https://storybook.mock/")}
```

The `if (!api) throw …` branch no longer appears in the output at all.

**Scope note:** this change is *not* applied — `.storybook/main.ts` is untouched on disk. Apply it
before writing the OTP stories.

### Which components are affected

| Component | Imports `otp.api`? | Blocked today |
| --- | --- | --- |
| `CodeCard` | No — only a `type` import, erased at compile time | **No — storyable now** |
| `CreateAppModal` | Yes | Yes |
| `AppRegistrationModal` (`CreateKeyModal.tsx`) | Yes (+ via `TwoFactorAppList`) | Yes |
| `GenerateSecretModal` | Yes | Yes |
| `VerifyCodeModal` | Yes | Yes |
| `TwoFactorAppList` (`App2faList.tsx`) | Yes | Yes |
| `TotpWidget` (`Otp.tsx`) | Yes (+ all of the above) | Yes |

---

## Section E — OTP component reference

Props read from source, not assumed. **Several differ from the brief** — corrections flagged.

| File | Export | Props |
| --- | --- | --- |
| `modules/otp/CodeCard.tsx` | `CodeCard` (named) | `codeItem: TotpCodeItem`, `onVerify?: (secretId: number) => void`, `onDelete?: (secretId: number) => void` |
| `modules/otp/CreateAppModal.tsx` | `CreateAppModal` (named) | `onCreated?: () => void` |
| `modules/otp/CreateKeyModal.tsx` | `AppRegistrationModal` (named) | `onRegistered?: () => void` |
| `modules/otp/GenerateSecretModal.tsx` | `GenerateSecretModal` (named) | `userId: number`, `onGenerated: () => void` *(required)* |
| `modules/otp/VerifyCodeModal.tsx` | `VerifyCodeModal` (named) | `secretId: number`, `onClose: () => void` |
| `modules/otp/Otp.tsx` | `TotpWidget` (**default export**) | none |
| `catalogs/OtpLists/App2faList.tsx` | `TwoFactorAppList` (named) | none — reads `App2FaContext` |

### Corrections to the brief

1. **No component takes `isOpen` / `onSuccess`.** `CreateAppModal`, `AppRegistrationModal` and
   `GenerateSecretModal` are **self-contained**: each renders its own trigger button and owns
   `isOpen` internally. A story that just renders one shows **a button, not a modal** — you need a
   `play` function to click it open (Section G, recipe 5).
2. **`CodeCard` takes one `codeItem` object**, not separate `code` and `remainingTime` props.
3. **`VerifyCodeModal` takes `secretId`, not `appId`**, has no `isOpen` (it is always open — the
   parent conditionally mounts it), and its success signal is internal `verificationResult` state
   plus a toast, not an `onSuccess` callback.
4. **`Otp.tsx` default-exports `TotpWidget`.** Import it as
   `import TotpWidget from '../components/modules/otp/Otp'`.
5. `CreateKeyModal.tsx` exports `AppRegistrationModal` — filename and export name differ.

### Provider / environment requirements

| Component | `ToastProvider` | `App2FaProvider` | `employeeCode` cookie | API calls |
| --- | --- | --- | --- | --- |
| `CodeCard` | — | — | — | none (uses `navigator.clipboard`) |
| `CreateAppModal` | on submit | — | — | `POST 2fa/apps` |
| `AppRegistrationModal` | on submit | recommended | **read at render** | `GET 2fa/apps`, `POST 2fa/register` |
| `GenerateSecretModal` | on open + submit | — | — | `GET 2fa/apps`, `POST 2fa/generate`, `POST 2fa/verify` |
| `VerifyCodeModal` | on submit | — | — | `POST 2fa/verify` |
| `TwoFactorAppList` | — | recommended | — | `GET 2fa/apps` |
| `TotpWidget` | on submit | recommended | **required** | `GET 2fa/codes`, `DELETE 2fa/secrets/:id`, plus all of the above |

Three precise notes, all verified in source:

- **Missing `ToastProvider` does not crash on render.** `ToastNotificationContext` is created with
  a `{} as ToastContextProps` default, so `useToastContext()` returns `{}` and the guard
  `if (!context) throw` never fires. `toast` is then `undefined` and the first `toast.success(…)`
  throws a `TypeError`. So: renders fine, blows up on interaction. Wrap it anyway.
- **Missing `App2FaProvider` does not crash either.** `App2FaContext`'s default is
  `{ selectedApp: 1, setSelectedApp: () => {} }`, so `TwoFactorAppList` renders but selection is a
  no-op. Wrap it if the story is meant to be interactive.
- **`TotpWidget` without the `employeeCode` cookie shows a permanent spinner.**
  `useGetEmployeeCode` polls the cookie every 500 ms (60 attempts). Until it resolves, `userId` is
  `0`, and `fetchTotpCodes` returns early at `if (!userId …) return` — *before* `setIsLoading(false)`.
  `isLoading` starts `true`, so the story spins forever. Set the cookie in a loader (Section G,
  recipe 3).

### States worth a story, per component

| Component | States |
| --- | --- |
| `CodeCard` | default (green ring) · warning (`remainingTime <= 10`, amber) · expiring (`<= 5`, red code block) · expired (`0`) · no `email` · read-only (no `onVerify`/`onDelete` → buttons hidden) · copied (internal, 1.5 s) · delete confirmation (internal) |
| `CreateAppModal` | trigger only (closed) · open + empty (submit disabled) · open + typed · submitting (`Creando...`) · API error → toast |
| `AppRegistrationModal` | trigger only · open form (app select + secret + email) · Yup validation errors · submitting · success → toast |
| `GenerateSecretModal` | trigger only · step 1 `select-app` · step 1 with empty app list · step 2 `show-secret` (QR + copy) · step 3 `verify` · invalid code · submitting |
| `VerifyCodeModal` | empty (button disabled until 6 digits) · filled · submitting (`Verificando...`) · valid result · invalid result |
| `TwoFactorAppList` | collapsed · expanded · search filtered · `No apps found` |
| `TotpWidget` | loading spinner · populated grid · empty state · load error + retry · error suppressing the empty state |

---

## Section F — Naming & file organization convention

```markdown
Format:          <ComponentName>.stories.tsx
Location:        src/stories/  — flat, NOT colocated with the component
Import style:    relative ('../components/UI/X'), though '@/' also resolves
Title hierarchy: 'Components/<ComponentName>'  — flat, single level
Story names:     'Default' always first; variants read 'With<X>' or '<X>Only'
                 (WithActiveFilters, WithMaxFilters, TextFieldOnly,
                  MultiSelectOnly, SingleSelectOnly)
```

Existing files:

```
src/stories/Autocomplete.stories.tsx            → Components/Autocomplete            (1 story)
src/stories/DataTable.stories.tsx               → Components/DataTable               (1 story)
src/stories/Filters.stories.tsx                 → Components/Filters                 (6 stories)
src/stories/PayrollPeriodSelector.stories.tsx   → Components/PayrollPeriodSelector   (1 story)
src/stories/Tabs.stories.tsx                    → Components/Tabs                    (1 story)
```

### Recommendation for OTP

Seven more entries at the flat `Components/*` level would bury the existing five. Use one extra
level — the smallest possible deviation:

```
Components/OTP/CodeCard
Components/OTP/CreateAppModal
Components/OTP/AppRegistrationModal
Components/OTP/GenerateSecretModal
Components/OTP/VerifyCodeModal
Components/OTP/TwoFactorAppList
Components/OTP/TotpWidget
```

Files stay flat in `src/stories/` to match: `src/stories/CodeCard.stories.tsx`, etc. Name story
files after the **export**, not the file — `AppRegistrationModal.stories.tsx`, not
`CreateKeyModal.stories.tsx`.

This is a judgement call, not an established rule — see Section I, open question 1.

---

## Section G — Recipes

None of these exist in the repo yet. They are proposals, built to stay inside the current
dependency set (no `msw`, no new packages).

### Recipe 1 — Provider decorators

```tsx
import type { Decorator } from '@storybook/nextjs'
import { ToastProvider } from '../context/UI/ToastNotificationContext'
import { App2FaProvider } from '../context/otp/App2faContext'

export const withToast: Decorator = Story => (
    <ToastProvider>
        <Story />
    </ToastProvider>
)

export const withApp2Fa: Decorator = Story => (
    <App2FaProvider>
        <Story />
    </App2FaProvider>
)
```

Apply per-meta rather than globally, so the existing five stories keep rendering bare:

```tsx
const meta = {
    title: 'Components/OTP/CreateAppModal',
    component: CreateAppModal,
    tags: ['autodocs'],
    decorators: [withToast],
    parameters: { layout: 'padded' },
} satisfies Meta<typeof CreateAppModal>
```

### Recipe 2 — Mocking the API without new dependencies

Every `*.api.ts` module calls the **default axios instance**, so one adapter swap intercepts all of
them. The route table comes from a story parameter:

```tsx
// src/stories/utils/withMockApi.tsx
import axios from 'axios'
import type { Decorator } from '@storybook/nextjs'

export interface MockRoute {
    method?: 'get' | 'post' | 'patch' | 'delete'
    url: RegExp
    status?: number
    data?: any
    delayMs?: number
}

export const withMockApi: Decorator = (Story, context) => {
    const routes: MockRoute[] = context.parameters.mockApi ?? []

    axios.defaults.adapter = config => {
        const method = (config.method ?? 'get').toLowerCase()
        const url = config.url ?? ''
        const route = routes.find(r => r.url.test(url) && (!r.method || r.method === method))

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (!route) {
                    reject(new Error(`No mock route for ${method.toUpperCase()} ${url}`))
                    return
                }
                const status = route.status ?? 200
                const response = { data: route.data, status, statusText: 'OK', headers: {}, config }
                if (status >= 400) {
                    const error = new Error(`Request failed with status ${status}`)
                    reject(Object.assign(error, { response }))
                } else {
                    resolve(response as any)
                }
            }, route.delayMs ?? 250)
        })
    }

    return <Story />
}
```

The rejected shape carries `error.response.data.message`, which is exactly what every OTP component
reads in its `catch`. Usage:

```tsx
export const WithApps: Story = {
    parameters: {
        mockApi: [
            {
                method: 'get',
                url: /2fa\/apps/,
                data: [{ id: 1, name: 'Microsoft 365', isActive: 1 }],
            },
            {
                method: 'post',
                url: /2fa\/generate/,
                data: {
                    secretId: 42,
                    secret: 'JBSWY3DPEHPK3PXP',
                    otpauthUrl:
                        'otpauth://totp/Allied:demo@allied.com?secret=JBSWY3DPEHPK3PXP&issuer=Allied',
                },
            },
        ],
    },
}

export const CreateFails: Story = {
    parameters: {
        mockApi: [
            {
                method: 'post',
                url: /2fa\/apps/,
                status: 409,
                data: { message: 'La aplicación ya existe' },
            },
        ],
    },
}
```

### Recipe 3 — Seeding the `employeeCode` cookie (required for `TotpWidget`)

```tsx
import Cookies from 'js-cookie'

const meta = {
    // …
    loaders: [
        () => {
            Cookies.set('employeeCode', '12345')
            return {}
        },
    ],
} satisfies Meta<typeof TotpWidget>
```

### Recipe 4 — Spied callbacks instead of `() => {}`

```tsx
import { fn } from 'storybook/test'

export const Default: Story = {
    args: {
        onVerify: fn(),
        onDelete: fn(),
    },
}
```

Ships with `storybook`; no install needed. Logs to the Actions panel and is assertable in `play`.

### Recipe 5 — Opening a self-triggering modal

`CreateAppModal`, `AppRegistrationModal` and `GenerateSecretModal` render only a button until
clicked, so the "open" states need a `play`:

```tsx
import { expect, userEvent, within } from 'storybook/test'

export const OpenEmptyForm: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /Nueva App/i }))
        await expect(canvas.getByRole('heading', { name: /Crear Aplicación/i })).toBeVisible()
    },
}
```

The modals render into the normal React tree (`fixed inset-0`, no portal), so `canvasElement` finds
them — `within(document.body)` is not needed.

### Recipe 6 — Complete, ready-to-paste `CodeCard` story

This one works **today**, with no config change and no mocks:

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs'
import { fn } from 'storybook/test'

import { CodeCard } from '../components/modules/otp/CodeCard'
import type { TotpCodeItem } from '../interfaces/otp.interface'

// --- Sample data ---
const sampleCode: TotpCodeItem = {
    secretId: 1,
    appId: 1,
    appName: 'Microsoft 365',
    email: 'carlos.garcia@allied.com',
    code: '482913',
    remainingTime: 24,
}

const meta = {
    title: 'Components/OTP/CodeCard',
    component: CodeCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component:
                    'Tarjeta de código TOTP con cuenta regresiva circular, copiado al portapapeles y confirmación de eliminación.',
            },
        },
    },
    args: {
        codeItem: sampleCode,
        onVerify: fn(),
        onDelete: fn(),
    },
} satisfies Meta<typeof CodeCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Warning: Story = {
    args: { codeItem: { ...sampleCode, remainingTime: 9 } },
    parameters: {
        docs: { description: { story: 'Con 10 segundos o menos el anillo pasa a ámbar.' } },
    },
}

export const ExpiringSoon: Story = {
    args: { codeItem: { ...sampleCode, remainingTime: 3 } },
    parameters: {
        docs: {
            description: { story: 'Con 5 segundos o menos el anillo y el código pasan a rojo.' },
        },
    },
}

export const Expired: Story = {
    args: { codeItem: { ...sampleCode, remainingTime: 0 } },
}

export const WithoutEmail: Story = {
    args: { codeItem: { ...sampleCode, email: '' } },
}

export const ReadOnly: Story = {
    args: { onVerify: undefined, onDelete: undefined },
    parameters: {
        docs: { description: { story: 'Sin callbacks solo se muestra el botón de copiar.' } },
    },
}
```

---

## Section H — OTP story implementation checklist

### Prerequisites

- [ ] Add `env` to `.storybook/main.ts` (Section D) — blocks six of seven components
- [ ] Fix `preview.ts` type import: `@storybook/nextjs-vite` → `@storybook/nextjs`
- [ ] Add `src/stories/utils/withMockApi.tsx` (Recipe 2)
- [ ] Add `src/stories/utils/decorators.tsx` with `withToast` / `withApp2Fa` (Recipe 1)
- [ ] Decide title hierarchy: `Components/OTP/*` vs flat `Components/*` (open question 1)

### CodeCard — *no prerequisites, write this one first*

- [ ] Story file created (`src/stories/CodeCard.stories.tsx`)
- [ ] `Default`
- [ ] `Warning` (`remainingTime: 9`)
- [ ] `ExpiringSoon` (`remainingTime: 3`)
- [ ] `Expired` (`remainingTime: 0`)
- [ ] `WithoutEmail`
- [ ] `ReadOnly` (no `onVerify` / `onDelete`)
- [ ] Props documented via autodocs

### CreateAppModal

- [ ] Story file created · `withToast` + `withMockApi`
- [ ] `Default` (trigger button only)
- [ ] `OpenEmptyForm` (play: click trigger; submit disabled)
- [ ] `Submitting` (play: type + click; `delayMs` high enough to catch `Creando...`)
- [ ] `CreateFails` (mock `409` + `{ message }` → error toast)
- [ ] Props documented

### AppRegistrationModal (`CreateKeyModal.tsx`)

- [ ] Story file created · `withToast` + `withApp2Fa` + `withMockApi` + cookie loader
- [ ] `Default` (trigger button only)
- [ ] `OpenEmptyForm`
- [ ] `ValidationErrors` (play: submit empty → Yup messages on `secret` + `email`)
- [ ] `RegisterFails`
- [ ] Props documented
- [ ] Docs note: renders through the shared `FormModal`, so layout is not OTP-specific

### GenerateSecretModal

- [ ] Story file created · `withToast` + `withMockApi`
- [ ] `Default` (trigger button only)
- [ ] `StepSelectApp` (mock `GET 2fa/apps`)
- [ ] `StepSelectAppEmpty` (mock returns `[]`)
- [ ] `StepShowSecret` (mock `POST 2fa/generate` → QR renders via `qrcode.react`)
- [ ] `StepVerify`
- [ ] `InvalidCode` (mock `POST 2fa/verify` → `{ valid: false }`)
- [ ] Props documented

### VerifyCodeModal

- [ ] Story file created · `withToast` + `withMockApi`
- [ ] `Default` (empty; verify button disabled)
- [ ] `Filled` (play: type 6 digits)
- [ ] `ValidCode` (mock `{ valid: true }` → green banner)
- [ ] `InvalidCode` (mock `{ valid: false }` → red banner)
- [ ] Props documented

### TwoFactorAppList (`App2faList.tsx`)

- [ ] Story file created · `withApp2Fa` + `withMockApi`
- [ ] `Default` (collapsed)
- [ ] `Expanded` (play: click)
- [ ] `NoApps` (mock `[]` → `No apps found`)
- [ ] Props documented (no props — document the context dependency instead)

### TotpWidget (`Otp.tsx`)

- [ ] Story file created · `withToast` + `withApp2Fa` + `withMockApi` + **cookie loader**
- [ ] `Loading` (mock with a long `delayMs`)
- [ ] `WithCodes` (3–4 sample `TotpCodeItem`s)
- [ ] `Empty` (mock `[]`)
- [ ] `LoadError` (mock `500` → banner + `Reintentar`)
- [ ] Docs note: the countdown ticks every second and refetches when any code hits `0`, so the
      story keeps hitting the mock adapter — keep `delayMs` low

---

## Section I — Open questions / decisions for review

1. **Title hierarchy.** The repo is strictly flat (`Components/<Name>`). Seven OTP entries would
   dominate that list. Section F recommends `Components/OTP/<Name>`; confirm before writing.
2. **Mocking strategy.** Recipe 2 (axios adapter) needs no new dependency and exercises the real
   `otp.api` module, error handling included. `msw` + `msw-storybook-addon` is the industry-standard
   alternative but adds two dev dependencies and a service worker in `public/`. Recipe 2 is the
   recommendation; the call is yours.
3. **Dark mode.** Every OTP component carries a full `dark:` variant set that no story can
   currently exercise on demand (Tailwind v4 default = `prefers-color-scheme`). Adding
   `@custom-variant dark (&:where(.dark, .dark *));` to `globals.css` plus a decorator toggling a
   class would make dark states storyable — but it changes app-wide styling behaviour, so it is out
   of scope for a Storybook task and needs a separate decision.
4. **Where should fixture data live?** `TotpCodeItem` samples are needed by both `CodeCard` and
   `TotpWidget` stories. The repo has no fixtures folder; suggest
   `src/stories/utils/otp.fixtures.ts` unless you prefer duplicating per file, which is what the
   existing stories do.
5. **`FormModal` is shared, not OTP-specific.** `AppRegistrationModal` renders through
   `src/components/UI/Modals/FormModalCreate.tsx`. That component arguably deserves its own
   `Components/FormModal` story; flagging it as adjacent scope, not included in the checklist above.
