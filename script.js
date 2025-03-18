import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    preloader.classList.add('fade-out');
    setTimeout(() => preloader.remove(), 500);
});

const typedText = new Typed('#typed-text', {
    strings: ["Hey, I’m Pratik!^500", "Hey, I’m Pratik! I’m a UI/UX designer^500", "Hey, I’m Pratik! I’m a UI/UX designer and a Data Science major!^1000"],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 1000,
    startDelay: 500,
    showCursor: true,
    cursorChar: '|',
    loop: false
});

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

particlesJS('particles-js', {
    particles: {
        number: { value: isMobile ? 15 : 30, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
        move: { enable: true, speed: isMobile ? 1 : 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
    },
    interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' }, resize: true },
        modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
    },
    retina_detect: true
});

const skills = [
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original-wordmark.svg' },
    { name: 'DBMS SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg' },
    { name: 'Git', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'Kotlin', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg' },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'C', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
    { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
    { name: 'PyTorch', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968706.png' },
    { name: 'Django', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' }
];

const displayedSkills = isMobile ? skills.slice(0, 12) : skills;

class SkillsGlobe {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('skillsGlobe'), antialias: true, alpha: true });
        this.controls = null;
        this.skillsGroup = new THREE.Group();
        this.tooltipDiv = null;
        this.radius = 1.5;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.isHovering = false;
        this.init();
    }

    init() {
        const container = document.querySelector('.canvas-container');
        const width = container.clientWidth;
        const height = container.clientHeight;
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.camera.position.z = 4;
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5).normalize();
        this.scene.add(ambientLight, directionalLight);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 6;
        this.controls.enableZoom = true;
        this.controls.enablePan = false;
        this.controls.rotateSpeed = 0.5;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 1;
        this.tooltipDiv = document.createElement('div');
        this.tooltipDiv.className = 'skill-tooltip';
        this.tooltipDiv.style.display = 'none';
        document.body.appendChild(this.tooltipDiv);
        this.addSkills();
        this.scene.add(this.skillsGroup);
        const canvasContainer = document.querySelector('.canvas-container');
        canvasContainer.addEventListener('mouseenter', () => {
            this.isHovering = true;
            this.controls.autoRotate = false;
        });
        canvasContainer.addEventListener('mouseleave', () => {
            this.isHovering = false;
            this.controls.autoRotate = true;
            this.tooltipDiv.style.display = 'none';
        });
        this.renderer.domElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
        this.renderer.domElement.addEventListener('touchmove', (event) => this.onTouchMove(event));
        window.addEventListener('resize', () => this.onWindowResize());
        this.animate();
    }

    addSkills() {
        const numSkills = displayedSkills.length;
        const phi = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < numSkills; i++) {
            const y = 1 - (i / (numSkills - 1)) * 2;
            const radius_at_y = Math.sqrt(1 - y * y);
            const theta = phi * i;
            const x = Math.cos(theta) * radius_at_y;
            const z = Math.sin(theta) * radius_at_y;
            const position = new THREE.Vector3(this.radius * x, this.radius * y, this.radius * z);
            const sprite = this.createSprite(displayedSkills[i], position);
            this.skillsGroup.add(sprite);
        }
    }

    createSprite(skill, position) {
        const loader = new THREE.TextureLoader();
        const tempMaterial = new THREE.SpriteMaterial({ color: 0xffffff, opacity: 0.5 });
        const sprite = new THREE.Sprite(tempMaterial);
        sprite.position.copy(position);
        sprite.scale.set(0.4, 0.4, 1);
        sprite.userData = { skill: skill, originalScale: 0.4 };
        loader.load(skill.icon, (texture) => {
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: true, depthWrite: false });
            sprite.material = material;
        });
        return sprite;
    }

    onMouseMove(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.updateHover();
    }

    onTouchMove(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        const touch = event.touches[0];
        this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        this.updateHover();
    }

    updateHover() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.skillsGroup.children);
        this.skillsGroup.children.forEach(sprite => {
            sprite.scale.set(sprite.userData.originalScale, sprite.userData.originalScale, 1);
        });
        if (intersects.length === 0) {
            this.tooltipDiv.style.display = 'none';
            return;
        }
        const intersectedSprite = intersects.find(intersect => intersect.object.isSprite && intersect.object.userData.skill);
        if (intersectedSprite) {
            const sprite = intersectedSprite.object;
            const skill = sprite.userData.skill;
            sprite.scale.set(0.55, 0.55, 1);
            this.tooltipDiv.textContent = skill.name;
            this.tooltipDiv.style.display = 'block';
            this.tooltipDiv.style.left = (this.mouse.x * window.innerWidth / 2 + window.innerWidth / 2 + 10) + 'px';
            this.tooltipDiv.style.top = (-this.mouse.y * window.innerHeight / 2 + window.innerHeight / 2 - 20) + 'px';
        }
    }

    onWindowResize() {
        const container = this.renderer.domElement.parentElement;
        const width = container.clientWidth;
        const height = container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            console.log('Theme switched to:', newTheme);
        });
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else {
        html.setAttribute('data-theme', 'dark');
    }

    const track = document.querySelector('.tiles-track');
    if (track) track.innerHTML += track.innerHTML;

    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                console.log('Scrolling to:', targetId);
            }
        });
    });

    // Ensure project cards are tappable on mobile
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const link = card.querySelector('a');
        if (link) {
            card.addEventListener('click', (e) => {
                // Prevent default if the click is on the link itself
                if (e.target.tagName !== 'A') {
                    window.open(link.href, '_blank');
                }
            });
        }
    });

    setTimeout(() => new SkillsGlobe(), 100);
});

window.addEventListener('scroll', () => {
    const stars = document.querySelector('#stars');
    const stars2 = document.querySelector('#stars2');
    const stars3 = document.querySelector('#stars3');
    const nebula = document.querySelector('.nebula');
    const scrollPosition = window.scrollY;
    const factor = isMobile ? 0.05 : 0.1;
    stars.style.transform = `translateY(${scrollPosition * factor}px)`;
    stars2.style.transform = `translateY(${scrollPosition * factor * 2}px)`;
    stars3.style.transform = `translateY(${scrollPosition * factor * 3}px)`;
    nebula.style.transform = `translateY(${scrollPosition * factor / 2}px)`;
    document.querySelector('.back-to-top').classList.toggle('visible', window.scrollY > 300);
});

document.querySelector('.back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});