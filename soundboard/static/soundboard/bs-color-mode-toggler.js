(() => {
    'use strict'

    const root = document.documentElement
    const systemMode = window.matchMedia('(prefers-color-scheme: dark)')
    const modes = ['light', 'dark', 'auto']
    const themes = ['v0', 'v1']
    const read = key => {
        try { return localStorage.getItem(key) } catch { return null }
    }
    const write = (key, value) => {
        try { localStorage.setItem(key, value) } catch { /* Storage may be disabled. */ }
    }
    const valid = (value, choices, fallback) => choices.includes(value) ? value : fallback
    // Preserve the existing color preference under its original storage key.
    let mode = valid(read('theme'), modes, 'auto')
    let theme = valid(read('soundboard-theme'), themes, 'v0')

    const render = () => {
        root.dataset.bsTheme = mode === 'auto' ? (systemMode.matches ? 'dark' : 'light') : mode
        root.dataset.soundboardTheme = theme
        const toggle = document.querySelector('#color-mode-toggle')
        if (toggle) {
            const next = modes[(modes.indexOf(mode) + 1) % modes.length]
            const label = `Color mode: ${mode}. Switch to ${next} mode`
            toggle.setAttribute('aria-label', label)
            toggle.title = label
            toggle.querySelectorAll('[data-mode-icon]').forEach(icon => {
                icon.toggleAttribute('hidden', icon.dataset.modeIcon !== mode)
            })
        }
        document.querySelectorAll('[data-site-theme]').forEach(button => {
            const active = button.dataset.siteTheme === theme
            button.classList.toggle('active', active)
            button.setAttribute('aria-pressed', String(active))
        })
        const label = document.querySelector('#site-theme-label')
        if (label) label.textContent = `Soundboard ${theme}`
    }

    // Apply preferences before styles and page content load.
    render()
    systemMode.addEventListener('change', render)
    window.addEventListener('storage', event => {
        if (event.key === 'theme' || event.key === 'soundboard-theme' || event.key === null) {
            mode = valid(read('theme'), modes, 'auto')
            theme = valid(read('soundboard-theme'), themes, 'v0')
            render()
        }
    })
    document.addEventListener('DOMContentLoaded', () => {
        render()
        document.querySelector('#color-mode-toggle').addEventListener('click', () => {
            mode = modes[(modes.indexOf(mode) + 1) % modes.length]
            write('theme', mode)
            render()
        })
        document.querySelectorAll('[data-site-theme]').forEach(button => {
            button.addEventListener('click', () => {
                theme = button.dataset.siteTheme
                write('soundboard-theme', theme)
                render()
            })
        })
    })
})()
