document.addEventListener('DOMContentLoaded', () => {
    const audio = document.querySelector('#audio_player')
    const buttons = [...document.querySelectorAll('.soundButton')]
    const status = document.querySelector('#player-status')
    let activeButton = null
    let progressFrame = null

    const updateProgress = () => {
        if (!activeButton) return
        const progress = Number.isFinite(audio.duration) && audio.duration > 0
            ? Math.min(1, Math.max(0, audio.currentTime / audio.duration)) : 0
        activeButton.style.setProperty('--sound-progress', progress)
    }
    const stopProgress = () => {
        if (progressFrame !== null) cancelAnimationFrame(progressFrame)
        progressFrame = null
    }
    const animateProgress = () => {
        updateProgress()
        progressFrame = requestAnimationFrame(animateProgress)
    }

    const reset = () => {
        stopProgress()
        buttons.forEach(button => {
            button.querySelector('i').classList.replace('fa-pause', 'fa-play')
            button.classList.remove('is-playing')
            button.style.removeProperty('--sound-progress')
            button.setAttribute('aria-pressed', 'false')
            button.setAttribute('aria-label', `Play ${button.dataset.soundName}`)
        })
        activeButton = null
    }
    const selected = document.querySelector('.sound-desk').dataset.selectedSound
    if (selected) {
        buttons.forEach(button => {
            const match = button.dataset.soundSlug === selected
            button.classList.toggle('soundButtonSelected', match)
            button.closest('.sound-card').classList.toggle('sound-card-muted', !match)
        })
    }

    buttons.forEach(button => button.addEventListener('keydown', event => {
        if (event.key === ' ') {
            event.preventDefault()
            button.click()
        }
    }))
    buttons.forEach(button => button.addEventListener('click', async event => {
        event.preventDefault()
        if (activeButton === button) {
            audio.pause()
            status.textContent = `Paused ${button.dataset.soundName}`
            reset()
            return
        }
        reset()
        activeButton = button
        button.querySelector('i').classList.replace('fa-play', 'fa-pause')
        button.classList.add('is-playing')
        button.setAttribute('aria-pressed', 'true')
        button.setAttribute('aria-label', `Pause ${button.dataset.soundName}`)
        audio.src = button.dataset.soundSrc
        try {
            await audio.play()
            if (activeButton === button) status.textContent = `Playing ${button.dataset.soundName}`
        } catch (error) {
            // A later click can interrupt a pending play request.
            if (activeButton === button && error.name !== 'AbortError') {
                reset()
                status.textContent = `Unable to play ${button.dataset.soundName}`
            }
        }
    }))

    const images = [...document.querySelectorAll('.sound-image')]
        .map(element => new bootstrap.Collapse(element, {toggle: false}))
    document.querySelector('#imageCheckBox').addEventListener('change', event => {
        images.forEach(image => event.target.checked ? image.show() : image.hide())
    })
    document.querySelector('#loopCheckBox').addEventListener('change', event => {
        audio.loop = event.target.checked
    })
    audio.addEventListener('playing', () => {
        stopProgress()
        if (activeButton) animateProgress()
    })
    audio.addEventListener('pause', stopProgress)
    audio.addEventListener('waiting', stopProgress)
    for (const event of ['timeupdate', 'loadedmetadata', 'durationchange', 'seeked']) {
        audio.addEventListener(event, updateProgress)
    }
    audio.addEventListener('ended', () => {
        reset()
        status.textContent = 'Playback finished'
    })
    audio.addEventListener('error', () => {
        reset()
        status.textContent = 'Unable to play this sound'
    })
})
