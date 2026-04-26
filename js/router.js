let pageUrls = {
    about: '/my-spa/?about',
    contact: '/my-spa/?contact',
    gallery: '/my-spa/?gallery'
};

function OnStartUp() {
    popStateHandler();
}

OnStartUp();

document.querySelector('#about-link').addEventListener('click', (event) => {
    let stateObj = { page:'about' };
    document.title = 'About';
    history.pushState(stateObj, "about", "?about");
    RenderAboutPage();
});

document.querySelector('#contact-link').addEventListener('click', (event) => {
    let stateObj = { page:'contact' };
    document.title = 'Contact';
    history.pushState(stateObj, "contact", "?contact");
    RenderContactPage();
});

document.querySelector('#gallery-link').addEventListener('click', () =>{
    let stateObj = { page:'gallery'};
    document.title = 'Gallery';
    history.pushState(stateObj, "gallery", "?gallery");
    RenderGalleryPage();
});

function RenderAboutPage() {
    document.querySelector('main').innerHTML = `
    <h1 class="title">About me</h1>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;

}

function RenderContactPage() {
    document.querySelector('main').innerHTML = `
        <h1 class="title">Contact with me</h1>

        <form id="contact-form">
            <label>Imię:</label>
            <input type="text" id="name" required>

            <label>Email:</label>
            <input type="email" id="email" required>

            <label>Wiadomość:</label>
            <textarea id="message" required></textarea>

            <div class="g-recaptcha" data-sitekey="TWOJ_SITE_KEY"></div>

            <button type="submit">Wyślij</button>
        </form>
    `;

    document.getElementById('contact-form').addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Form submitted!');
    });
}

function RenderGalleryPage(){
    document.querySelector('main').innerHTML =`
    <h1 class="title">Gallery</h1>
        <div class="gallery" id="gallery"></div>

        <div id="modal" class="modal">
            <span id="close">&times;</span>
            <img class="modal-content" id="modal-img">
        </div>`;

    const gallery = document.getElementById('gallery');

    const imageUrls = [
        'https://picsum.photos/300?1',
        'https://picsum.photos/300?2',
        'https://picsum.photos/300?3',
        'https://picsum.photos/300?4',
        'https://picsum.photos/300?5',
        'https://picsum.photos/300?6',
        'https://picsum.photos/300?7',
        'https://picsum.photos/300?8',
        'https://picsum.photos/300?9'
    ];

    imageUrls.forEach(url => {
        const img = document.createElement('img');
        img.dataset.src = url;
        img.classList.add('lazy');
        gallery.appendChild(img);
    });

    lazyLoad();
    modalSetup();
}

function lazyLoad() {
    const images = document.querySelectorAll('img');

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const img = entry.target;

                fetch(img.dataset.src)
                    .then(res => res.blob())
                    .then(blob => {
                        img.src = URL.createObjectURL(blob);

                        img.onload = () => {
                            img.classList.add('loaded');
                        };
                    });
                
                    obs.unobserve(img);
            }
        });
    });

    
    images.forEach(img => observer.observe(img));
}

function modalSetup() {
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.getElementById("close");

    document.querySelectorAll('.gallery img').forEach(img => {
        img.onclick = () => {
            if (!img.src) return;
            modal.style.display = "block";
            modalImg.src = img.src;
        };
    });

    closeBtn.onclick = () => modal.style.display = "none";
    
    modal.onclick = (e) => {
        if (e.target === modal) modal.style.display = "none";
    };
}

window.onpopstate = popStateHandler;

function popStateHandler() {
    let loc = window.location.href.toString().split(window.location.host)[1];

    console.log(loc);    

    if (loc === pageUrls.contact) { RenderContactPage(); }
    if (loc === pageUrls.about) { RenderAboutPage(); }
    if (loc === pageUrls.gallery) { RenderGalleryPage();}
}

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});