// main.js
// Navigation hover effects
document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('mouseover', () => {
        link.classList.add('pop-out')
    })
    link.addEventListener('mouseout', () => {
        link.classList.remove('pop-out')
    })
})

// Banner image fade in
window.addEventListener('load', () => {
    const bannerImage = document.getElementById('banner-image')
    if (bannerImage) {
        bannerImage.style.opacity = 0
        bannerImage.style.transition = 'opacity 2s'
        bannerImage.style.opacity = 1
    }
})

// Add this to your main.js file

// Modal functionality
document.addEventListener('DOMContentLoaded', () => {
    // Get all profile images
    const profileImages = document.querySelectorAll('.profile-img')

    // Get all modals
    const modals = document.querySelectorAll('.modal')

    // Get all close buttons
    const closeButtons = document.querySelectorAll('.close')

    // Add click event to profile images
    profileImages.forEach((img) => {
        img.addEventListener('click', () => {
            const modalId = img.getAttribute('data-modal')
            const modal = document.getElementById(modalId)
            if (modal) {
                modal.style.display = 'block'
                document.body.style.overflow = 'hidden' // Prevent scrolling
            }
        })
    })

    // Add click event to close buttons
    closeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal')
            if (modal) {
                modal.style.display = 'none'
                document.body.style.overflow = 'auto' // Restore scrolling
            }
        })
    })

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none'
            document.body.style.overflow = 'auto' // Restore scrolling
        }
    })

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            modals.forEach((modal) => {
                modal.style.display = 'none'
            })
            document.body.style.overflow = 'auto' // Restore scrolling
        }
    })
})
